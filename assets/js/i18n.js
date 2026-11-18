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
            nav: { home: 'Home', about: 'About', projects: 'Projects', skills: 'Skills', resume: 'Resume', contact: 'Contact' },
            hero: {
                titlePre: 'Turning',
                titlePost: 'into intelligent systems',
                desc: 'Smart web systems. AI-powered automations. Full-stack products that ship. I build the engine that runs your business — not just the small stuff around it.',
                cta: 'Explore My Work',
                stage1: 'Business', stage2: 'Software', stage3: 'AI', stage4: 'Guidance', stage5: 'Impact',
                stage1sub: 'process, as-is', stage2sub: 'built & shipped', stage3sub: 'automated', stage4sub: 'team enabled', stage5sub: 'measured',
                cycle: ['ideas', 'workflows', 'spreadsheets', 'bottlenecks', 'businesses'],
                chipOnline: 'Online now', chipChat: '💬 Chat with AI Omer'
            },
            about: {
                role0year: '11.2026 — Present',
                role0title: 'AI Solutions Engineer',
                role0desc: 'Designing and implementing applied AI solutions for real business workflows — from automation to AI-integrated systems in production.',
                new: 'New'
            }
        },
        he: {
            dir: 'rtl',
            logo: 'עומר מנדלאוי',
            nav: { home: 'בית', about: 'אודות', projects: 'פרויקטים', skills: 'מיומנויות', resume: 'רזומה', contact: 'צור קשר' },
            hero: {
                titlePre: 'הופך',
                titlePost: 'למערכות חכמות',
                desc: 'מערכות WEB חכמות. אוטומציות מבוססות AI. מוצרים פול-סטאק שבאמת יוצאים לאוויר. אני בונה את המנוע שמריץ את העסק - לא רק את הדברים הקטנים סביבו.',
                cta: 'לתיק העבודות',
                stage1: 'עסק', stage2: 'תוכנה', stage3: 'AI', stage4: 'הדרכה', stage5: 'השפעה',
                stage1sub: 'תהליך קיים', stage2sub: 'נבנה ושוחרר', stage3sub: 'אוטומציה', stage4sub: 'הצוות מוכן', stage5sub: 'נמדד',
                cycle: ['רעיונות', 'תהליכים', 'גיליונות אקסל', 'צווארי בקבוק', 'עסקים'],
                chipOnline: 'זמין עכשיו', chipChat: '💬 שוחח עם AI Omer'
            },
            about: {
                role0year: '11.2026 — היום',
                role0title: 'AI Solutions Engineer',
                role0desc: 'מתכנן ובונה פתרונות AI יישומיים לתהליכים עסקיים אמיתיים - מאוטומציה ועד מערכות עם AI משולב שרצות בפרודקשן.',
                new: 'חדש'
            }
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

        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: d } }));
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

    window.I18n = {
        apply,
        get current() { return current; },
        cycleWords(lang) { return (dict[lang || current] && dict[lang || current].hero && dict[lang || current].hero.cycle) || []; }
    };
})();
