import importlib.util
import json
import os
import tempfile
import unittest
from unittest.mock import patch, MagicMock

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODULE_PATH = os.path.join(REPO_ROOT, "scripts", "update_citations.py")
MODULE_SPEC = importlib.util.spec_from_file_location("update_citations", MODULE_PATH)
update_citations = importlib.util.module_from_spec(MODULE_SPEC)
MODULE_SPEC.loader.exec_module(update_citations)


GOOD_DATA = {
    "updated": "2026-09-28T00:00:00Z",
    "name": "Laeeq Aslam",
    "affiliation": "Example University",
    "total_citations": 84,
    "citations_per_year": {2026: 32},
    "h_index": 5,
    "i10_index": 3,
    "total_publications": 10,
    "source": "Google Scholar",
}


class CitationUpdaterTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.output_file = os.path.join(self.tempdir.name, "citations.json")
        self.status_file = os.path.join(self.tempdir.name, "citation-status.json")
        self.file_patch = patch.multiple(
            update_citations,
            OUTPUT_FILE=self.output_file,
            STATUS_FILE=self.status_file,
        )
        self.file_patch.start()

    def tearDown(self):
        self.file_patch.stop()
        self.tempdir.cleanup()

    def write_existing(self, citations=83, failures=0):
        with open(self.output_file, "w") as output:
            json.dump({"total_citations": citations}, output)
        with open(self.status_file, "w") as status:
            json.dump({"consecutive_failures": failures}, status)

    def test_success_writes_valid_snapshot_and_resets_failures(self):
        self.write_existing(failures=2)
        with patch.object(update_citations, "fetch_citations", return_value=GOOD_DATA):
            result = update_citations.main()

        self.assertEqual(result, 0)
        with open(self.output_file) as output:
            self.assertEqual(json.load(output)["total_citations"], 84)
        with open(self.status_file) as status:
            saved_status = json.load(status)
        self.assertTrue(saved_status["success"])
        self.assertEqual(saved_status["consecutive_failures"], 0)

    def test_failure_preserves_snapshot_increments_status_and_returns_nonzero(self):
        self.write_existing(failures=1)
        with patch.object(
            update_citations, "fetch_citations", side_effect=RuntimeError("blocked")
        ):
            result = update_citations.main()

        self.assertEqual(result, 1)
        with open(self.output_file) as output:
            self.assertEqual(json.load(output)["total_citations"], 83)
        with open(self.status_file) as status:
            saved_status = json.load(status)
        self.assertFalse(saved_status["success"])
        self.assertEqual(saved_status["consecutive_failures"], 2)
        self.assertEqual(saved_status["error"], "blocked")

    def test_failure_retains_success_timestamp(self):
        with open(self.output_file, "w") as output:
            json.dump(GOOD_DATA, output)
        with patch.object(update_citations, "fetch_citations", side_effect=RuntimeError("blocked")):
            self.assertEqual(update_citations.main(), 1)
        with open(self.status_file) as status:
            data = json.load(status)
        self.assertEqual(data["last_updated"], GOOD_DATA["updated"])
        self.assertIn("last_attempt", data)

    def test_first_failure_does_not_invent_zero_metrics(self):
        with patch.object(update_citations, "fetch_citations", side_effect=RuntimeError("blocked")):
            self.assertEqual(update_citations.main(), 1)
        self.assertFalse(os.path.exists(self.output_file))

    def test_citation_regression_is_rejected(self):
        self.write_existing(citations=83)
        regressed = {**GOOD_DATA, "total_citations": 10, "citations_per_year": {2026: 10}}
        with patch.object(update_citations, "fetch_citations", return_value=regressed):
            result = update_citations.main()

        self.assertEqual(result, 1)
        with open(self.output_file) as output:
            self.assertEqual(json.load(output)["total_citations"], 83)
        with open(self.status_file) as status:
            self.assertIn("regressed", json.load(status)["error"])


class RetrievalTests(unittest.TestCase):
    def test_html_parser_keeps_zero_years_and_uses_all_time_metrics(self):
        html = b'''<div id="gsc_prf_in">Laeeq Aslam</div><div class="gsc_prf_il">GTIIT</div>
        <table id="gsc_rsb_st">
        <tr><td class="gsc_rsb_sc1">Citations</td><td class="gsc_rsb_std">1,111</td><td class="gsc_rsb_std">99</td></tr>
        <tr><td class="gsc_rsb_sc1">h-index</td><td class="gsc_rsb_std">6</td></tr>
        <tr><td class="gsc_rsb_sc1">i10-index</td><td class="gsc_rsb_std">3</td></tr></table>
        <span class="gsc_g_t">2024</span><span class="gsc_g_t">2025</span><span class="gsc_g_t">2026</span>
        <a class="gsc_g_a" style="z-index:3"><span class="gsc_g_al">2</span></a>
        <a class="gsc_g_a" style="z-index:1"><span class="gsc_g_al">47</span></a>'''
        data = update_citations.parse_scholar_html(html)
        self.assertEqual(data["total_citations"], 1111)
        self.assertEqual(data["citations_per_year"], {2024: 2, 2025: 0, 2026: 47})
        self.assertNotIn("total_publications", data)
        update_citations.validate_data(data)

    def test_block_page_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "block page"):
            update_citations.parse_scholar_html(b"<html>CAPTCHA</html>")

    def test_incomplete_api_metrics_are_rejected(self):
        payload = {"author": {"name": "Laeeq Aslam"}, "cited_by": {"table": [], "graph": []}}
        with patch.object(update_citations, "fetch_url", return_value=json.dumps(payload)):
            data = update_citations.scrape_with_serpapi("test-key")
        with self.assertRaisesRegex(ValueError, "missing fields"):
            update_citations.validate_data(data)

    def test_api_response_uses_all_time_counts(self):
        payload = {"author": {"name": "Laeeq Aslam", "affiliations": "GTIIT"}, "cited_by": {
            "table": [{"citations": {"all": 84, "since_2021": 82}},
                      {"h_index": {"all": 5}}, {"i10_index": {"all": 3}}],
            "graph": [{"year": 2026, "citations": 32}]}}
        with patch.object(update_citations, "fetch_url", return_value=json.dumps(payload)):
            data = update_citations.scrape_with_serpapi("test-key")
        update_citations.validate_data(data)
        self.assertEqual(data["total_citations"], 84)

    def test_bad_api_data_falls_back_to_direct(self):
        with patch.dict(os.environ, {"SERPAPI_API_KEY": "test-key"}), patch.object(
            update_citations, "scrape_with_serpapi", return_value={}
        ), patch.object(update_citations, "fetch_url", return_value=b"profile"), patch.object(
            update_citations, "parse_scholar_html", return_value=GOOD_DATA
        ):
            self.assertEqual(update_citations.fetch_citations(), GOOD_DATA)

    def test_transient_request_is_retried_with_timeout(self):
        response = MagicMock()
        response.__enter__.return_value.read.return_value = b"profile"
        with patch.object(update_citations, "urlopen", side_effect=[TimeoutError(), response]) as request, patch.object(
            update_citations.time, "sleep"
        ):
            self.assertEqual(update_citations.fetch_url("https://example.org"), b"profile")
            self.assertEqual(request.call_count, 2)
            self.assertEqual(request.call_args.kwargs["timeout"], 20)

    def test_http_errors_do_not_leak_api_keys(self):
        error = update_citations.HTTPError("https://example.org?api_key=secret", 403, "secret", {}, None)
        with patch.object(update_citations, "urlopen", side_effect=error):
            with self.assertRaisesRegex(RuntimeError, "HTTP 403") as raised:
                update_citations.fetch_url("https://example.org?api_key=secret")
        self.assertNotIn("secret", str(raised.exception))

    def test_invalid_yearly_counts_are_rejected(self):
        for counts in ({2026: -1}, {2026: True}, {"bad": 2}, {2026: 999}, {}):
            with self.subTest(counts=counts), self.assertRaises(ValueError):
                update_citations.validate_data({**GOOD_DATA, "citations_per_year": counts})


if __name__ == "__main__":
    unittest.main()
