# Laeeq Aslam academic website

This website presents Laeeq Aslam's current research profile. The main GTIIT project is low-cost drone-based wind estimation and wind-field reconstruction using Physics-Informed Neural Networks (PINNs). Parallel research lines include physics-guided forecasting for wind-energy and grid-reliability systems, and climate-risk intelligence for urban heat and infrastructure resilience.

Public pages intentionally omit the phone number; the downloadable resume keeps full contact details.

## Citation updates

The weekly GitHub Action fetches the public Google Scholar profile directly, with
20-second request timeouts and up to three attempts for transient failures. It
preserves the last validated snapshot when blocked; the website shows the snapshot
date and whether the latest update failed. Unknown publication counts are omitted
rather than reported as zero.

The updater uses only the public Google Scholar profile URL and standard HTTP
requests; no API key or third-party service is required. It retries transient
connection/server failures, validates the returned profile, and preserves the
last known-good snapshot if Scholar returns a block page or HTTP 403. Google may
still rate-limit or block automated GitHub-hosted requests, in which case the
workflow records the failure and keeps the existing data.

Run locally with `python3 -m pip install -r requirements-citations.txt` and
`python3 scripts/update_citations.py`. Run both the Python updater tests and JavaScript citation display tests with
`npm test` (Python 3 and Node.js 20+ required).
