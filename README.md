# Laeeq Aslam academic website

This website presents Laeeq Aslam's current research profile. The main GTIIT project is low-cost drone-based wind estimation and wind-field reconstruction using Physics-Informed Neural Networks (PINNs). Parallel research lines include physics-guided forecasting for wind-energy and grid-reliability systems, and climate-risk intelligence for urban heat and infrastructure resilience.

Public pages intentionally omit the phone number; the downloadable resume keeps full contact details.

## Citation figures

Citation totals, h-index, i10-index, the snapshot date, and yearly chart values
are maintained manually in `index.html`. The current snapshot was supplied as a screenshot on
18 November 2026: 117 citations (115 since 2021), h-index 6, and i10-index 3.
The user confirmed 52 citations for 2026 so far and 43 for 2025. Older yearly
chart counts are approximate readings of the screenshot's unlabeled bars.

To update, check the linked Google Scholar profile, edit `stat-citations`,
`stat-hindex`, `stat-i10`, and `citation-freshness`, then update the `cpy` values
and dated comment inside `loadCitationsChart()`. There is no citation scraper,
scheduled citation workflow, API key, or automatic refresh.

Run the citation display checks with `npm test` (Node.js 20+ required).

## Homepage theme

The homepage defaults to light mode. The moon/sun button in the navigation is
available on desktop and mobile, and remembers an explicit choice in browser
storage. Theme controls work independently of external icon and animation scripts.
