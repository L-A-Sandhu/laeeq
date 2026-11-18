// Apply a visitor's explicit choice before the page paints. New visitors see light mode.
(() => {
    const root = document.documentElement;
    let theme = 'light';
    try {
        if (localStorage.getItem('theme') === 'dark') theme = 'dark';
    } catch (_) { /* Theme switching also works when browser storage is unavailable. */ }
    root.setAttribute('data-theme', theme);

    document.addEventListener('DOMContentLoaded', () => {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;
        function updateButton() {
            const dark = root.getAttribute('data-theme') === 'dark';
            const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
            toggle.setAttribute('aria-label', label);
            toggle.setAttribute('title', label);
            toggle.setAttribute('aria-pressed', String(dark));
        }
        updateButton();
        toggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (_) { /* Optional persistence. */ }
            updateButton();
        });
    });
})();
