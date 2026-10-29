"""
Fetch Google Scholar profile and save citation data as JSON.
Runs via GitHub Actions weekly. Falls back gracefully on failure.
"""
import json
import os
import re
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from datetime import datetime, timezone

SCHOLAR_ID = "oGVYJ5wAAAAJ"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_FILE = os.path.join(REPO_ROOT, "citations.json")
STATUS_FILE = os.path.join(REPO_ROOT, "citation-status.json")


def utc_now():
    """Return an ISO-8601 UTC timestamp."""
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def fetch_url(url):
    """Bound every request and retry only transient transport/server failures."""
    for attempt in range(3):
        try:
            request = Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "en-US,en;q=0.9"})
            with urlopen(request, timeout=20) as response:
                return response.read()
        except HTTPError as error:
            if error.code not in (429, 500, 502, 503, 504) or attempt == 2:
                # Do not include URLs: API URLs contain credentials.
                raise RuntimeError(f"Citation provider returned HTTP {error.code}") from None
        except (URLError, TimeoutError, OSError):
            if attempt == 2:
                raise RuntimeError("Citation provider connection failed after 3 attempts") from None
        time.sleep(2 ** attempt)


def parse_scholar_html(html):
    """Extract the public profile, including years with no citation bar."""
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "html.parser")
    name = soup.select_one("#gsc_prf_in")
    if name is None:
        raise ValueError("Scholar returned a block page or an incomplete profile")
    metrics = {}
    keys = {"Citations": "total_citations", "h-index": "h_index", "i10-index": "i10_index"}
    for row in soup.select("#gsc_rsb_st tr"):
        label, value = row.select_one(".gsc_rsb_sc1"), row.select_one(".gsc_rsb_std")
        if label and value and label.get_text(strip=True) in keys:
            metrics[keys[label.get_text(strip=True)]] = int(value.get_text(strip=True).replace(",", ""))

    years = [int(node.get_text()) for node in soup.select(".gsc_g_t")]
    counts = dict.fromkeys(years, 0)
    for bar in soup.select(".gsc_g_a"):
        # Scholar omits zero bars; z-index gives the year offset from the end.
        position = re.search(r"z-index\s*:\s*(\d+)", bar.get("style", ""))
        value = bar.select_one(".gsc_g_al")
        if not position or value is None or not 1 <= int(position[1]) <= len(years):
            raise ValueError("Scholar citation chart has an unrecognized format")
        counts[years[-int(position[1])]] = int(value.get_text().replace(",", ""))
    affiliation = soup.select_one(".gsc_prf_il")
    return {
        "updated": utc_now(), "name": name.get_text(strip=True),
        "affiliation": affiliation.get_text(strip=True) if affiliation else "",
        **metrics, "citations_per_year": counts, "source": "Google Scholar",
    }


def scrape_with_serpapi(api_key):
    """Use the author API when a repository secret is configured."""
    query = urlencode({"engine": "google_scholar_author", "author_id": SCHOLAR_ID,
                       "hl": "en", "api_key": api_key})
    payload = json.loads(fetch_url("https://serpapi.com/search.json?" + query))
    if payload.get("error"):
        raise ValueError("SerpApi could not retrieve the Scholar profile; check API quota and credentials")
    metrics = {}
    keys = {"citations": "total_citations", "h_index": "h_index", "i10_index": "i10_index"}
    cited_by = payload.get("cited_by", {})
    for row in cited_by.get("table", []):
        for key, target in keys.items():
            if key in row:
                metrics[target] = row[key]["all"]
    author = payload.get("author", {})
    return {
        "updated": utc_now(), "name": author.get("name", ""),
        "affiliation": author.get("affiliations", ""), **metrics,
        "citations_per_year": {item["year"]: item["citations"] for item in cited_by.get("graph", [])},
        "source": "Google Scholar",
    }


def fetch_citations(existing=None):
    """Prefer the configured API, with validated direct retrieval as fallback."""
    providers = []
    api_key = os.environ.get("SERPAPI_API_KEY", "").strip()
    if api_key:
        providers.append(("SerpApi", lambda: scrape_with_serpapi(api_key)))
    providers.append(("Direct Scholar", lambda: parse_scholar_html(fetch_url(
        "https://scholar.google.com/citations?" + urlencode({"user": SCHOLAR_ID, "hl": "en"})
    ))))
    errors = []
    for label, provider in providers:
        try:
            data = provider()
            validate_data(data, existing)
            return data
        except Exception as error:
            # Sanitize even unexpected provider errors before persisting/logging.
            message = str(error).replace(api_key, "[redacted]") if api_key else str(error)
            errors.append(f"{label}: {message}")
    raise RuntimeError("; ".join(errors))


def validate_data(data, existing=None):
    """Reject incomplete or regressed data before replacing the snapshot."""
    required = ("name", "total_citations", "h_index", "i10_index", "citations_per_year")
    missing = [key for key in required if key not in data]
    if missing:
        raise ValueError(f"Scholar response is missing fields: {', '.join(missing)}")

    for key in ("total_citations", "h_index", "i10_index"):
        if type(data[key]) is not int or data[key] < 0:
            raise ValueError(f"Scholar response has invalid {key}: {data[key]!r}")

    if not isinstance(data["citations_per_year"], dict):
        raise ValueError("Scholar response has invalid citations_per_year")

    if not isinstance(data["name"], str) or not data["name"].strip():
        raise ValueError("Scholar response has no author name")
    for year, count in data["citations_per_year"].items():
        if not re.fullmatch(r"\d{4}", str(year)) or type(count) is not int or count < 0:
            raise ValueError("Scholar response has invalid yearly citation data")
    if data["total_citations"] and not data["citations_per_year"]:
        raise ValueError("Scholar response is missing yearly citation data")
    if sum(data["citations_per_year"].values()) > data["total_citations"]:
        raise ValueError("Yearly citations exceed the citation total")

    # Citation totals should not decrease between weekly snapshots. Treat a
    # regression as a partial/bad scrape and retain the last known good data.
    if existing and isinstance(existing.get("total_citations"), int):
        previous = existing["total_citations"]
        if data["total_citations"] < previous:
            raise ValueError(
                f"Citation total regressed from {previous} to {data['total_citations']}"
            )


def load_existing():
    """Load existing citations.json if it exists."""
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE) as f:
            return json.load(f)
    return None


def load_existing_status():
    """Load existing citation-status.json if it exists."""
    if os.path.exists(STATUS_FILE):
        with open(STATUS_FILE) as f:
            return json.load(f)
    return None


def main():
    existing = load_existing()
    prev_status = load_existing_status() or {}
    prev_failures = prev_status.get("consecutive_failures", 0)

    try:
        print("Scraping Google Scholar...")
        data = fetch_citations(existing)
        validate_data(data, existing)
        print(f"  Citations: {data['total_citations']}")
        print(f"  h-index: {data['h_index']}")
        print(f"  i10-index: {data['i10_index']}")
        print(f"  Years of data: {len(data['citations_per_year'])}")

        with open(OUTPUT_FILE, "w") as f:
            json.dump(data, f, indent=2)

        # Also write a status file so the site can show last-updated info
        with open(STATUS_FILE, "w") as f:
            json.dump({
                "last_updated": data["updated"],
                "last_attempt": utc_now(),
                "total_citations": data["total_citations"],
                "h_index": data["h_index"],
                "source": "Google Scholar",
                "success": True,
                "consecutive_failures": 0
            }, f, indent=2)

        print("citations.json updated successfully.")
        return 0

    except Exception as e:
        print(f"Scholar scrape failed: {e}")

        if existing:
            print("Keeping existing citations.json (last known data).")

        with open(STATUS_FILE, "w") as f:
            json.dump({
                "last_updated": existing.get("updated") if existing else None,
                "last_attempt": utc_now(),
                "success": False,
                "error": str(e)[:200],
                "consecutive_failures": prev_failures + 1
            }, f, indent=2)

        return 1


if __name__ == "__main__":
    sys.exit(main())
