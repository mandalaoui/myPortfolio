// Mobile menu: a side drawer (#navDrawer) opened by the hamburger.
// Its links are cloned from the desktop .nav-links, so there is one list to
// maintain (i18n.js translates both, since they share data-i18n keys).
// Must load before navigation.js, so the clones also get smooth scrolling.

(function () {
    const hamburger = document.querySelector('.hamburger');
    const source = document.querySelector('.nav-links');
    const drawer = document.getElementById('navDrawer');
    if (!hamburger || !source || !drawer) return;

    const list = drawer.querySelector('.nav-drawer-links');
    const panel = drawer.querySelector('.nav-drawer-panel');
    const closeBtn = drawer.querySelector('.nav-drawer-close');

    const ICONS = {
        '#home': 'fa-house',
        '#avatar': 'fa-comment-dots',
        '#projects-title': 'fa-folder-open',
        '#ai-title': 'fa-wand-magic-sparkles',
        '#about': 'fa-user',
        '#skills': 'fa-layer-group',
        '#contact': 'fa-envelope'
    };
    const LABELS = {
        en: { open: 'Open menu', close: 'Close menu' },
        he: { open: 'פתיחת תפריט', close: 'סגירת תפריט' }
    };

    const links = Array.from(source.querySelectorAll('a')).map((original, i) => {
        const href = original.getAttribute('href');
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = href;
        a.className = 'nav-drawer-link';
        a.innerHTML = `
            <span class="nav-drawer-num">${String(i + 1).padStart(2, '0')}</span>
            <i class="fas ${ICONS[href] || 'fa-circle'}" aria-hidden="true"></i>
            <span class="nav-drawer-label"></span>
            <i class="fas fa-chevron-right nav-drawer-chevron" aria-hidden="true"></i>`;
        const label = a.querySelector('.nav-drawer-label');
        label.textContent = original.textContent;
        if (original.dataset.i18n) label.setAttribute('data-i18n', original.dataset.i18n);
        li.appendChild(a);
        list.appendChild(li);
        return a;
    });

    // Highlight the section the visitor is currently in.
    function markCurrent() {
        let current = null;
        for (const a of links) {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) continue;
            const zoomY = window.ZoomTransition && window.ZoomTransition.scrollTargetFor(target);
            const y = typeof zoomY === 'number' ? zoomY : target.getBoundingClientRect().top + window.scrollY;
            if (y <= window.scrollY + window.innerHeight * 0.3) current = a;
        }
        links.forEach((a) => {
            if (a === current) a.setAttribute('aria-current', 'location');
            else a.removeAttribute('aria-current');
        });
    }

    function isOpen() {
        return drawer.classList.contains('open');
    }

    function open() {
        markCurrent();
        drawer.inert = false;
        drawer.classList.add('open');
        document.documentElement.classList.add('nav-drawer-open');
        hamburger.setAttribute('aria-expanded', 'true');
        // After the slide starts, so focusing doesn't jump the panel.
        setTimeout(() => closeBtn.focus({ preventScroll: true }), 50);
    }

    function close(returnFocus) {
        if (!isOpen()) return;
        drawer.classList.remove('open');
        drawer.inert = true;
        document.documentElement.classList.remove('nav-drawer-open');
        hamburger.setAttribute('aria-expanded', 'false');
        if (returnFocus) hamburger.focus({ preventScroll: true });
    }

    hamburger.addEventListener('click', () => (isOpen() ? close(true) : open()));
    drawer.querySelectorAll('[data-drawer-close]').forEach((el) => el.addEventListener('click', () => close(true)));
    // Registered before navigation.js's handler, so the page is unlocked before it scrolls.
    links.forEach((a) => a.addEventListener('click', () => close(false)));
    drawer.querySelectorAll('.nav-drawer-foot a').forEach((a) => a.addEventListener('click', () => close(false)));

    document.addEventListener('keydown', (event) => {
        if (!isOpen()) return;
        if (event.key === 'Escape') {
            close(true);
        } else if (event.key === 'Tab') {
            // Keep keyboard focus inside the drawer.
            const focusable = Array.from(panel.querySelectorAll('a, button'));
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });

    // Back to desktop width -> no drawer.
    window.matchMedia('(min-width: 37.5625rem)').addEventListener('change', (e) => { if (e.matches) close(false); });

    function applyLabels() {
        const lang = document.documentElement.lang === 'he' ? 'he' : 'en';
        hamburger.setAttribute('aria-label', LABELS[lang].open);
        closeBtn.setAttribute('aria-label', LABELS[lang].close);
    }
    applyLabels();
    document.addEventListener('langchange', applyLabels);
})();
