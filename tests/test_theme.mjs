import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../theme.js', import.meta.url), 'utf8');

function page(savedTheme, storageBlocked = false) {
    const attributes = {};
    const buttonAttributes = {};
    let ready, click;
    const root = {
        setAttribute(name, value) { attributes[name] = value; },
        getAttribute(name) { return attributes[name]; },
    };
    const button = {
        setAttribute(name, value) { buttonAttributes[name] = value; },
        addEventListener(name, callback) { if (name === 'click') click = callback; },
    };
    const storage = { theme: savedTheme };
    vm.runInNewContext(source, {
        document: {
            documentElement: root,
            addEventListener(name, callback) { if (name === 'DOMContentLoaded') ready = callback; },
            getElementById() { return button; },
        },
        localStorage: {
            getItem(name) { if (storageBlocked) throw Error('Blocked'); return storage[name]; },
            setItem(name, value) { if (storageBlocked) throw Error('Blocked'); storage[name] = value; },
        },
    });
    assert.ok(attributes['data-theme'], 'Theme is applied before DOMContentLoaded');
    ready();
    return { attributes, buttonAttributes, storage, click: () => click() };
}

test('new visitors default to light; repeated toggles update the theme and accessible label', () => {
    const p = page();
    assert.equal(p.attributes['data-theme'], 'light');
    for (const theme of ['dark', 'light', 'dark', 'light']) {
        p.click();
        assert.equal(p.attributes['data-theme'], theme);
        assert.equal(p.storage.theme, theme);
        assert.equal(p.buttonAttributes['aria-pressed'], String(theme === 'dark'));
        assert.equal(p.buttonAttributes['aria-label'], `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
});

test('explicit saved preferences are restored; invalid values default to light', () => {
    for (const [saved, expected] of [['dark', 'dark'], ['light', 'light'], ['invalid', 'light']]) {
        assert.equal(page(saved).attributes['data-theme'], expected);
    }
});

test('theme controls work without storage or external libraries', () => {
    const p = page(undefined, true);
    assert.equal(p.attributes['data-theme'], 'light');
    p.click();
    assert.equal(p.attributes['data-theme'], 'dark');
    p.click();
    assert.equal(p.attributes['data-theme'], 'light');
});
