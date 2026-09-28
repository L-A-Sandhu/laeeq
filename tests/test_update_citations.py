import importlib.util
import json
import os
import tempfile
import unittest
from unittest.mock import patch

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
        with patch.object(update_citations, "scrape_with_scholarly", return_value=GOOD_DATA):
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
            update_citations, "scrape_with_scholarly", side_effect=RuntimeError("blocked")
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

    def test_citation_regression_is_rejected(self):
        self.write_existing(citations=83)
        regressed = {**GOOD_DATA, "total_citations": 10}
        with patch.object(update_citations, "scrape_with_scholarly", return_value=regressed):
            result = update_citations.main()

        self.assertEqual(result, 1)
        with open(self.output_file) as output:
            self.assertEqual(json.load(output)["total_citations"], 83)
        with open(self.status_file) as status:
            self.assertIn("regressed", json.load(status)["error"])


if __name__ == "__main__":
    unittest.main()
