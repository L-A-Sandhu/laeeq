# Laeeq Aslam academic website

This website presents Laeeq Aslam's current research profile. The main GTIIT project is low-cost drone-based wind estimation and wind-field reconstruction using Physics-Informed Neural Networks (PINNs). Parallel research lines include physics-guided forecasting for wind-energy and grid-reliability systems, and climate-risk intelligence for urban heat and infrastructure resilience.

Public pages intentionally omit the phone number; the downloadable resume keeps full contact details.

## Citation updates

The weekly GitHub Action fetches the public Google Scholar profile directly, with
20-second request timeouts and up to three attempts for transient failures. It
preserves the last validated snapshot when blocked; the website shows the snapshot
date and whether the latest update failed. Unknown publication counts are omitted
rather than reported as zero.

For runners blocked by Scholar, configure a `SERPAPI_API_KEY` repository Actions
secret from your own SerpApi account. The updater then prefers the
[Google Scholar Author API](https://serpapi.com/google-scholar-author-cited-by),
falling back to direct retrieval if the API fails. No API account is required for
direct retrieval, and no credentials belong in the repository. Provider availability
and account quota can still cause updates to fail.

Run locally with `python3 -m pip install -r requirements-citations.txt` and
`python3 scripts/update_citations.py`. Run both the Python updater tests and JavaScript citation display tests with
`npm test` (Python 3 and Node.js 20+ required).
