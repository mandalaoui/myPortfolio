// AI Hub (Layer 5): a featured card + a horizontal row of cards, with type filters.
//
// While ITEMS is empty the section shows a "Coming soon" state: the same
// layout as ghost placeholders (no made-up titles). The demo content that
// showed the full layout is kept in the git branch `ai-hub-demo`.
// To publish, add real items to ITEMS (newest first, each with a `url`);
// see CONTENT_GUIDE.md.
//
//   type:   'video' | 'deck' | 'article'
//   meta:   video -> duration text ('4:12'); deck -> slide count; article -> minutes
//   source: shown on videos (e.g. 'YouTube')
//   url:    external link (video page, hosted deck, article)
(function () {
    const ITEMS = [];

    const STR = {
        en: {
            all: 'All', video: 'Videos', deck: 'Talks', article: 'Articles',
            kind: { video: 'Video', deck: 'Talk', article: 'Article' },
            action: { video: 'Watch video', deck: 'Open deck', article: 'Read article' },
            latest: 'Latest', more: 'More',
            slides: (n) => n + ' slides', minutes: (n) => n + ' min read',
            filters: 'Filter by type', prev: 'Previous items', next: 'Next items',
            soonKind: 'Coming soon',
            soonTitle: 'New content on the way',
            soonDesc: 'Videos, talks and articles on applied AI, from real projects and trainings.'
        },
        he: {
            all: 'הכול', video: 'סרטונים', deck: 'הרצאות', article: 'מאמרים',
            kind: { video: 'סרטון', deck: 'הרצאה', article: 'מאמר' },
            action: { video: 'צפייה בסרטון', deck: 'פתיחת המצגת', article: 'קריאת המאמר' },
            latest: 'חדש', more: 'עוד',
            slides: (n) => n + ' שקפים', minutes: (n) => n + ' דק׳ קריאה',
            filters: 'סינון לפי סוג', prev: 'הפריטים הקודמים', next: 'הפריטים הבאים',
            soonKind: 'בקרוב',
            soonTitle: 'תוכן חדש בדרך',
            soonDesc: 'סרטונים, הרצאות ומאמרים על AI יישומי, מתוך פרויקטים והדרכות אמיתיים.'
        }
    };

    const KIND_ICON = { video: 'ti-video', deck: 'ti-presentation', article: 'ti-article' };

    const root = document.getElementById('aiHubContent');
    if (!root) return;

    let filter = 'all';

    function lang() {
        return document.documentElement.getAttribute('lang') === 'he' ? 'he' : 'en';
    }

    function esc(s) {
        return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    function badge(item, s) {
        if (item.type === 'deck') return s.slides(item.meta);
        if (item.type === 'article') return s.minutes(item.meta);
        return item.meta;
    }

    function thumb(item, s) {
        let art;
        if (item.type === 'video') {
            art = '<span class="hub-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>';
        } else if (item.type === 'deck') {
            art = '<span class="hub-slide" aria-hidden="true"><i class="w55 strong"></i><i></i><i class="w75"></i><i class="w50"></i></span>';
        } else {
            art = '<span class="hub-lines" aria-hidden="true"><i class="w55 strong"></i><i></i><i class="w88"></i><i class="w60"></i></span>';
        }
        return '<div class="hub-thumb">' + art + '<span class="hub-badge">' + esc(badge(item, s)) + '</span></div>';
    }

    function action(item, s) {
        const label = esc(s.action[item.type]);
        const icon = '<svg class="hub-ext" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        if (item.url) {
            return '<a class="hub-action" href="' + esc(item.url) + '" target="_blank" rel="noopener noreferrer">' + label + icon + '</a>';
        }
        return '<span class="hub-action">' + label + icon + '</span>';
    }

    function kindLabel(item, s, prefix) {
        return '<span class="hub-kind"><span class="hub-kind-dot hub-kind-' + item.type + '" aria-hidden="true"></span>' +
            (prefix ? esc(prefix) + ' · ' : '') + esc(s.kind[item.type]) + '</span>';
    }

    function card(item, s, l) {
        const src = item.type === 'video' && item.source ? esc(item.source) : '';
        return '<article class="hub-card" data-type="' + item.type + '">' +
            thumb(item, s) +
            '<div class="hub-card-body">' +
            kindLabel(item, s) +
            '<h3 class="hub-card-title">' + esc(item.title[l]) + '</h3>' +
            (src ? '<p class="hub-card-src">' + src + '</p>' : '') +
            action(item, s) +
            '</div></article>';
    }

    function featured(item, s, l) {
        const desc = item.desc[l];
        return '<article class="hub-feat" data-type="' + item.type + '">' +
            thumb(item, s) +
            '<div class="hub-feat-body">' +
            kindLabel(item, s, s.latest) +
            '<h3 class="hub-feat-title">' + esc(item.title[l]) + '</h3>' +
            (desc ? '<p class="hub-feat-desc">' + esc(desc) + '</p>' : '') +
            action(item, s) +
            '</div></article>';
    }

    // "Coming soon": the hub layout with empty ghost cards (decorative).
    function soon(s) {
        const lines = '<span class="hub-lines" aria-hidden="true"><i class="w55 strong"></i><i></i><i class="w75"></i></span>';
        const ghost = '<div class="hub-card hub-ghost" aria-hidden="true"><div class="hub-thumb">' + lines + '</div>' +
            '<div class="hub-card-body"><i class="hub-bar w75"></i><i class="hub-bar w50"></i></div></div>';
        const clock = '<span class="hub-play hub-soon-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="100%" height="100%">' +
            '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
        return '<article class="hub-feat hub-soon">' +
            '<div class="hub-thumb">' + clock + '</div>' +
            '<div class="hub-feat-body">' +
            '<span class="hub-kind"><span class="hub-kind-dot hub-kind-video" aria-hidden="true"></span>' + esc(s.soonKind) + '</span>' +
            '<h3 class="hub-feat-title">' + esc(s.soonTitle) + '</h3>' +
            '<p class="hub-feat-desc">' + esc(s.soonDesc) + '</p>' +
            '</div></article>' +
            '<div class="hub-row hub-ghost-row" aria-hidden="true">' + ghost + ghost + ghost + ghost + ghost + '</div>';
    }

    function render() {
        const l = lang();
        const s = STR[l];
        if (!ITEMS.length) {
            root.innerHTML = soon(s);
            return;
        }
        const list = ITEMS.filter((it) => filter === 'all' || it.type === filter);

        const chips = ['all', 'video', 'deck', 'article'].map((f) =>
            '<button type="button" class="hub-chip" data-filter="' + f + '" aria-pressed="' + (f === filter) + '">' + esc(s[f]) + '</button>'
        ).join('');

        let html = '<div class="hub-chips" role="group" aria-label="' + esc(s.filters) + '">' + chips + '</div>';
        if (list.length) {
            html += featured(list[0], s, l);
            if (list.length > 1) {
                const chevron = '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                html += '<p class="hub-more-label">' + esc(s.more) + '</p>' +
                    '<div class="hub-row-wrap">' +
                    '<button type="button" class="hub-arrow hub-arrow-prev" data-dir="-1" aria-label="' + esc(s.prev) + '" hidden>' + chevron + '</button>' +
                    '<div class="hub-row">' + list.slice(1).map((it) => card(it, s, l)).join('') + '</div>' +
                    '<button type="button" class="hub-arrow hub-arrow-next" data-dir="1" aria-label="' + esc(s.next) + '" hidden>' + chevron + '</button>' +
                    '</div>';
            }
        }
        root.innerHTML = html;
        setupRow();
    }

    // Desktop arrows: shown only while there is more to scroll in that direction.
    // scrollLeft is negative in RTL, so positions are measured with Math.abs.
    function updateArrows() {
        const row = root.querySelector('.hub-row');
        if (!row) return;
        const max = row.scrollWidth - row.clientWidth;
        const pos = Math.abs(row.scrollLeft);
        const prev = root.querySelector('.hub-arrow-prev');
        const next = root.querySelector('.hub-arrow-next');
        if (!prev || !next) return; // "Coming soon" row has no arrows
        prev.hidden = pos <= 2;
        next.hidden = pos >= max - 2;
    }

    function setupRow() {
        const row = root.querySelector('.hub-row');
        if (!row) return;
        row.addEventListener('scroll', updateArrows, { passive: true });
        updateArrows();
    }

    root.addEventListener('click', (e) => {
        const arrow = e.target.closest('.hub-arrow');
        if (!arrow) return;
        const row = root.querySelector('.hub-row');
        const rtl = document.documentElement.getAttribute('dir') === 'rtl';
        const step = Number(arrow.getAttribute('data-dir')) * (rtl ? -1 : 1);
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const max = row.scrollWidth - row.clientWidth;
        const target = Math.max(-max, Math.min(max, row.scrollLeft + step * row.clientWidth * 0.8));
        row.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' });
    });

    window.addEventListener('resize', updateArrows);

    root.addEventListener('click', (e) => {
        const chip = e.target.closest('.hub-chip');
        if (!chip) return;
        filter = chip.getAttribute('data-filter');
        render();
        const again = root.querySelector('.hub-chip[data-filter="' + filter + '"]');
        if (again) again.focus({ preventScroll: true });
        if (window.ZoomTransition && ZoomTransition.refresh) ZoomTransition.refresh();
    });

    document.addEventListener('langchange', render);
    render();
})();
