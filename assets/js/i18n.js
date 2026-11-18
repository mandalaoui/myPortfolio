// Bilingual (EN/HE) infrastructure. Only nav labels are wired up today;
// each future layer adds its own section's strings to the dictionaries below
// using the same data-i18n="namespace.key" pattern, until the whole site
// (Layer 8) is covered.
(function () {
    const STORAGE_KEY = 'portfolio-lang';

    const dict = {
        en: {
            dir: 'ltr',
            logo: 'Omer Mandalaoui',
            nav: { home: 'Home', about: 'About', projects: 'Projects', skills: 'Skills', resume: 'Resume', contact: 'Contact' }
        },
        he: {
            dir: 'rtl',
            logo: 'עומר מנדלאוי',
            nav: { home: 'בית', about: 'אודות', projects: 'פרויקטים', skills: 'מיומנויות', resume: 'רזומה', contact: 'צור קשר' }
        }
    };

    function resolve(lang, path) {
        const parts = path.split('.');
        let node = dict[lang];
        for (const p of parts) {
            if (node == null) return null;
            node = node[p];
        }
        return node;
    }

    function apply(lang) {
        const d = dict[lang] ? lang : 'en';
        document.documentElement.setAttribute('lang', d);
        document.documentElement.setAttribute('dir', dict[d].dir);

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const value = resolve(d, el.getAttribute('data-i18n'));
            if (typeof value === 'string') el.textContent = value;
        });

        const label = document.getElementById('langToggleLabel');
        if (label) label.textContent = d === 'en' ? 'עב' : 'EN';

        try { localStorage.setItem(STORAGE_KEY, d); } catch (e) { /* ignore (private mode, etc.) */ }

        if (window.ScrollTrigger) {
            setTimeout(() => window.ScrollTrigger.refresh(), 50);
        }
    }

    let current = 'en';
    try { current = localStorage.getItem(STORAGE_KEY) || 'en'; } catch (e) { /* ignore */ }
    apply(current);

    const btn = document.getElementById('langToggle');
    if (btn) {
        btn.addEventListener('click', () => {
            current = current === 'en' ? 'he' : 'en';
            apply(current);
        });
    }

    window.I18n = { apply, get current() { return current; } };
})();
