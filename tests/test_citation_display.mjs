import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = html.indexOf('async function loadCitationsChart()');
const end = html.indexOf("document.addEventListener('DOMContentLoaded'", start);
const source = html.slice(start, end);
async function display(data, status, { offline = false, statusOffline = false } = {}) {
    const elements = Object.fromEntries(['stat-citations', 'stat-hindex', 'stat-i10', 'citation-freshness'].map(id => [id, { textContent: id === 'citation-freshness' ? 'Loading citation data…' : '—' }]));
    const context = vm.createContext({
        document: { getElementById: id => elements[id] }, console: { warn() {} },
        fetch: async url => {
            if (offline || (statusOffline && url === 'citation-status.json')) throw new Error('offline');
            return { ok: true, json: async () => url === 'citations.json' ? data : status };
        },
    });
    await vm.runInContext(source + '\nloadCitationsChart()', context);
    return elements;
}
const snapshot = { updated: new Date().toISOString(), total_citations: 0, h_index: 0, i10_index: 0, citations_per_year: {} };
test('zero metrics remain visible and date is shown', async () => {
    const result = await display(snapshot, { success: true });
    assert.equal(result['stat-citations'].textContent, 0);
    assert.equal(result['stat-hindex'].textContent, 0);
    assert.match(result['citation-freshness'].textContent, /Updated/);
    assert.doesNotMatch(result['citation-freshness'].textContent, /failed|overdue/);
});
test('failed refresh explains saved snapshot', async () => {
    const result = await display(snapshot, { success: false, last_attempt: new Date(Date.now() + 1000).toISOString() });
    assert.match(result['citation-freshness'].textContent, /Latest update failed; showing saved data/);
});
test('old snapshots show overdue status', async () => {
    const result = await display({ ...snapshot, updated: '2020-01-01T00:00:00Z' }, { success: true });
    assert.match(result['citation-freshness'].textContent, /Update overdue/);
});
test('status failure does not hide saved figures', async () => {
    const result = await display({ ...snapshot, total_citations: 111 }, null, { statusOffline: true });
    assert.equal(result['stat-citations'].textContent, 111);
    assert.match(result['citation-freshness'].textContent, /Update status unavailable/);
});
test('unavailable data gives a visible explanation', async () => {
    const result = await display(null, null, { offline: true });
    assert.match(result['citation-freshness'].textContent, /Citation data unavailable/);
});
