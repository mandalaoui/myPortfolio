// AI Hub (Layer 5): a featured card + a horizontal row of cards, with type filters.
//
// Content is DEMO data until real items exist. To add a real item, add an
// object to ITEMS (newest first) and give it a `url`; delete the demo ones.
// Items without a `url` render their action label as plain text (not a link).
//
//   type:   'video' | 'deck' | 'article'
//   meta:   video -> duration text ('4:12'); deck -> slide count; article -> minutes
//   source: shown on videos (e.g. 'YouTube')
//   url:    external link (video page, hosted deck, article)
(function () {
    const ITEMS = [
        {
            type: 'video', meta: '4:12', source: 'YouTube', demo: true,
            title: { en: 'Building a RAG chatbot from scratch', he: 'בניית צ׳אטבוט RAG מאפס' },
            desc: { en: 'From documents to embeddings to answers with sources: a walkthrough of the pieces and the mistakes worth avoiding.', he: 'ממסמכים ל-embeddings ועד תשובות עם מקורות: סקירה של החלקים ושל הטעויות שכדאי להימנע מהן.' }
        },
        {
            type: 'deck', meta: 14, demo: true,
            title: { en: 'AI agents in the enterprise', he: 'סוכני AI בארגון' },
            desc: { en: 'Where agents actually help in business workflows, and where a plain automation is enough.', he: 'איפה סוכנים באמת עוזרים בתהליכים עסקיים, ואיפה אוטומציה פשוטה מספיקה.' }
        },
        {
            type: 'article', meta: 6, demo: true,
            title: { en: 'What MCP changes for integrations', he: 'מה MCP משנה באינטגרציות' },
            desc: { en: 'One protocol instead of a custom connector per tool.', he: 'פרוטוקול אחד במקום מחבר מותאם לכל כלי.' }
        },
        {
            type: 'video', meta: '1:30', source: 'YouTube', demo: true,
            title: { en: 'n8n workflow in 90 seconds', he: 'תהליך n8n ב-90 שניות' },
            desc: { en: '', he: '' }
        },
        {
            type: 'deck', meta: 22, demo: true,
            title: { en: 'Prompting vs fine-tuning', he: 'Prompting מול fine-tuning' },
            desc: { en: '', he: '' }
        },
        {
            type: 'article', meta: 9, demo: true,
            title: { en: 'Vector search with pgvector', he: 'חיפוש וקטורי עם pgvector' },
            desc: { en: '', he: '' }
        },
        {
            type: 'video', meta: '7:45', source: 'YouTube', demo: true,
            title: { en: 'Streaming AI answers with the Vercel AI SDK', he: 'הזרמת תשובות AI עם Vercel AI SDK' },
            desc: { en: '', he: '' }
        },
        {
            type: 'article', meta: 5, demo: true,
            title: { en: 'Evaluating LLM answers without guessing', he: 'הערכת תשובות LLM בלי לנחש' },
            desc: { en: '', he: '' }
        },
        {
            type: 'deck', meta: 18, demo: true,
            title: { en: 'From prototype to production AI', he: 'מאב טיפוס ל-AI בפרודקשן' },
            desc: { en: '', he: '' }
        },
        {
            type: 'video', meta: '3:05', source: 'YouTube', demo: true,
            title: { en: 'Tool calling explained', he: 'Tool calling בקצרה' },
            desc: { en: '', he: '' }
        }
    ];

    const STR = {
        en: {
            all: 'All', video: 'Videos', deck: 'Talks', article: 'Articles',
            kind: { video: 'Video', deck: 'Talk', article: 'Article' },
            action: { video: 'Watch video', deck: 'Open deck', article: 'Read article' },
            latest: 'Latest', more: 'More',
            slides: (n) => n + ' slides', minutes: (n) => n + ' min read',
            filters: 'Filter by type', prev: 'Previous items', next: 'Next items'
        },
        he: {
            all: 'הכול', video: 'סרטונים', deck: 'הרצאות', article: 'מאמרים',
            kind: { video: 'סרטון', deck: 'הרצאה', article: 'מאמר' },
            action: { video: 'צפייה בסרטון', deck: 'פתיחת המצגת', article: 'קריאת המאמר' },
            latest: 'חדש', more: 'עוד',
            slides: (n) => n + ' שקפים', minutes: (n) => n + ' דק׳ קריאה',
            filters: 'סינון לפי סוג', prev: 'הפריטים הקודמים', next: 'הפריטים הבאים'
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

    function render() {
        const l = lang();
        const s = STR[l];
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
