import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = html.indexOf('function loadCitationsChart()');
const end = html.indexOf("document.addEventListener('DOMContentLoaded'", start);
const source = html.slice(start, end);
const stat = id => html.match(new RegExp(`id="${id}"[^>]*>([^<]+)<`))[1];

function draw({ chartUnavailable = false } = {}) {
    let chart;
    const context = vm.createContext({
        console: { warn() {} },
        fetch() { assert.fail('Static citations must not make network requests'); },
        document: { getElementById: () => ({
            getContext: () => ({ createLinearGradient: () => ({ addColorStop() {} }) }),
        }) },
        Chart: function (_canvas, options) {
            if (chartUnavailable) throw new Error('Chart unavailable');
            chart = options;
        },
    });
    vm.runInContext(source + '\nloadCitationsChart()', context);
    return chart;
}

test('static citation figures and snapshot date are present without JavaScript', () => {
    for (const id of ['stat-citations', 'stat-hindex', 'stat-i10']) {
        assert.match(stat(id), /^\d+$/);
    }
    assert.match(stat('citation-freshness'), /Google Scholar · As of/);
    assert.doesNotMatch(stat('citation-freshness'), /failed|overdue|Loading/);
});

test('chart renders embedded yearly counts without data requests', () => {
    const chart = draw();
    assert.ok(chart);
    const years = Array.from(chart.data.labels);
    const values = Array.from(chart.data.datasets[0].data);
    assert.equal(years.length, values.length);
    assert.ok(values.every(value => Number.isInteger(value) && value >= 0));
    assert.ok(values.reduce((sum, value) => sum + value, 0) <= Number(stat('stat-citations')));
});

test('chart failure leaves the static citation figures available', () => {
    assert.doesNotThrow(() => draw({ chartUnavailable: true }));
    assert.match(stat('stat-citations'), /^\d+$/);
    assert.match(stat('citation-freshness'), /As of/);
});

test('citation snapshot and latest years match the supplied figures', () => {
    assert.equal(stat('stat-citations'), '117');
    assert.equal(stat('stat-hindex'), '6');
    assert.equal(stat('stat-i10'), '3');
    const chart = draw();
    const counts = Object.fromEntries(chart.data.labels.map((year, i) => [year, chart.data.datasets[0].data[i]]));
    assert.equal(counts['2025'], 43);
    assert.equal(counts['2026'], 52);
});
