"""
Scrape Google Scholar profile and save citation data as JSON.
Runs via GitHub Actions weekly. Falls back gracefully on failure.
"""
import json
import os
import sys
from datetime import datetime

SCHOLAR_ID = "oGVYJ5wAAAAJ"
OUTPUT_FILE = "citations.json"
STATUS_FILE = "citation-status.json"

def scrape_with_scholarly():
    """Use scholarly library to get author data."""
    try:
        from scholarly import scholarly, ProxyGenerator
    except ImportError:
        print("scholarly not installed, installing...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "scholarly"])
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
        "updated": datetime.utcnow().isoformat() + "Z",
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

    except Exception as e:
        print(f"Scholar scrape failed: {e}")

        if existing:
            print("Keeping existing citations.json (last known data).")
        else:
            # Create a fallback file with manual data
            data = {
                "updated": datetime.utcnow().isoformat() + "Z",
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
                "last_updated": datetime.utcnow().isoformat() + "Z",
                "success": False,
                "error": str(e)[:200],
                "consecutive_failures": prev_failures + 1
            }, f, indent=2)

        sys.exit(0)  # Don't fail the workflow — keep last known data


if __name__ == "__main__":
    main()
