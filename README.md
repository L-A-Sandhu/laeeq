# Laeeq Aslam academic website

This website presents Laeeq Aslam's current research profile. The main GTIIT project is low-cost drone-based wind estimation and wind-field reconstruction using Physics-Informed Neural Networks (PINNs). Parallel research lines include physics-guided forecasting for wind-energy and grid-reliability systems, and climate-risk intelligence for urban heat and infrastructure resilience.

Public pages intentionally omit the phone number; the downloadable resume keeps full contact details.

## Citation figures

Citation totals, h-index, i10-index, the snapshot date, and yearly chart values
are maintained manually in `index.html`. The current snapshot is dated
29 October 2026: 111 citations, h-index 6, and i10-index 3. Live Scholar access
was blocked during this change, so these saved figures have not been presented
as newly verified counts.

To update, check the linked Google Scholar profile, edit `stat-citations`,
`stat-hindex`, `stat-i10`, and `citation-freshness`, then update the `cpy` values
and dated comment inside `loadCitationsChart()`. There is no citation scraper,
scheduled citation workflow, API key, or automatic refresh.

Run the citation display checks with `npm test` (Node.js 20+ required).
