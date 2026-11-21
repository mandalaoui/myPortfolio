// Legal pages: show the English or Hebrew version, matching the language the
// visitor chose on the main site (same localStorage key as i18n.js).
(function () {
    const KEY = 'portfolio-lang';
    let lang = 'en';
    try { lang = localStorage.getItem(KEY) === 'he' ? 'he' : 'en'; } catch (e) { /* ignore */ }

    const toggle = document.getElementById('legalLang');
    const back = document.getElementById('legalBack');

    function apply() {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-lang]').forEach((el) => el.classList.toggle('on', el.dataset.lang === lang));
        if (toggle) toggle.textContent = lang === 'he' ? 'English' : 'עברית';
        if (back) back.textContent = lang === 'he' ? '→ חזרה לאתר' : '← Back to site';
        const title = document.querySelector(`[data-lang="${lang}"] h1`);
        if (title) document.title = `${title.textContent} | Omer Mandalaoui`;
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            lang = lang === 'he' ? 'en' : 'he';
            try { localStorage.setItem(KEY, lang); } catch (e) { /* ignore */ }
            apply();
        });
    }
    apply();
})();
