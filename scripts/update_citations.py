"""
Scrape Google Scholar profile and save citation data as JSON.
Runs via GitHub Actions weekly. Falls back gracefully on failure.
"""
import json
import os
import sys
from datetime import datetime, timezone

SCHOLAR_ID = "oGVYJ5wAAAAJ"
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_FILE = os.path.join(REPO_ROOT, "citations.json")
STATUS_FILE = os.path.join(REPO_ROOT, "citation-status.json")


def utc_now():
    """Return an ISO-8601 UTC timestamp."""
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

def scrape_with_scholarly():
    """Use scholarly library to get author data."""
    from scholarly import scholarly, ProxyGenerator

    # GitHub Actions runner IPs are shared/heavily scraped and frequently
    # get blocked by Google Scholar. Route through rotating free proxies
    # to avoid the "Cannot Fetch from Google Scholar" block.
    pg = ProxyGenerator()
    if not pg.FreeProxies():
        print("Warning: could not set up free proxies, trying direct connection.")
    else:
        scholarly.use_proxy(pg)

    author = scholarly.search_author_id(SCHOLAR_ID)
    if not author:
        raise ValueError(f"Could not find author with ID {SCHOLAR_ID}")

    author = scholarly.fill(author, sections=["basics", "indices", "counts"])

    data = {
        "updated": utc_now(),
        "name": author.get("name", "Laeeq Aslam"),
        "affiliation": author.get("affiliation", ""),
        "total_citations": author.get("citedby", 0),
        "citations_per_year": author.get("cites_per_year", {}),
        "h_index": author.get("hindex", 0),
        "i10_index": author.get("i10index", 0),
        "total_publications": author.get("publications", []).__len__() if isinstance(author.get("publications"), list) else 0,
        "source": "Google Scholar"
    }

    # Convert numeric keys to int for JSON
    if data["citations_per_year"]:
        data["citations_per_year"] = {
            int(k): v for k, v in data["citations_per_year"].items()
        }

    return data


def validate_data(data, existing=None):
    """Reject incomplete or regressed data before replacing the snapshot."""
    required = ("name", "total_citations", "h_index", "i10_index", "citations_per_year")
    missing = [key for key in required if key not in data]
    if missing:
        raise ValueError(f"Scholar response is missing fields: {', '.join(missing)}")

    for key in ("total_citations", "h_index", "i10_index"):
        if not isinstance(data[key], int) or data[key] < 0:
            raise ValueError(f"Scholar response has invalid {key}: {data[key]!r}")

    if not isinstance(data["citations_per_year"], dict):
        raise ValueError("Scholar response has invalid citations_per_year")

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
        data = scrape_with_scholarly()
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
        else:
            # Create a fallback file with manual data
            data = {
                "updated": utc_now(),
                "name": "Laeeq Aslam",
                "total_citations": 0,
                "citations_per_year": {},
                "h_index": 0,
                "i10_index": 0,
                "source": "Google Scholar (scrape failed, manual fallback)"
            }
            with open(OUTPUT_FILE, "w") as f:
                json.dump(data, f, indent=2)

        with open(STATUS_FILE, "w") as f:
            json.dump({
                "last_updated": utc_now(),
                "success": False,
                "error": str(e)[:200],
                "consecutive_failures": prev_failures + 1
            }, f, indent=2)

        return 1


if __name__ == "__main__":
    sys.exit(main())
