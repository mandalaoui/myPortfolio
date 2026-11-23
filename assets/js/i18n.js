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
            nav: { home: 'Home', chat: 'AI Omer', projects: 'Projects', ai: 'AI', about: 'About', skills: 'Stack', contact: 'Contact' },
            hero: {
                titlePre: 'Turning',
                titlePost: 'into intelligent systems',
                badge: 'AI & FULL-STACK ENGINEER · AI TRAINING',
                desc: 'Smart web systems, AI automations and full-stack products that run every day inside real businesses. I build them, launch them, and train your team to use them.',
                cta: 'Explore My Work',
                stage1: 'Business', stage2: 'Software', stage3: 'AI', stage4: 'Guidance', stage5: 'Impact',
                stage1sub: "today's process", stage2sub: 'built & shipped', stage3sub: 'automated', stage4sub: 'team trained', stage5sub: 'results tracked',
                cycle: ['ideas', 'workflows', 'spreadsheets', 'bottlenecks', 'manual work'],
                chipOnline: 'Online now', chipChat: '💬 Chat with AI Omer'
            },
            about: {
                title: 'About Me',
                who: 'Who I Am',
                timeline: 'Education & Experience',
                headline: 'I build AI systems that run inside real businesses, and teach teams to use them.',
                bio1: "I'm an AI and full-stack engineer with a B.Sc. in Computer Science from Bar-Ilan University. I work forward-deployed style: directly with the business, from the first conversation to software running in production.",
                bio2: "My work covers the whole path: understanding how a business actually operates, designing the solution, building the frontend, backend and AI integrations, deploying it, and teaching the team to use it. Before tech, I served nearly four years as an HR officer in the IDF, leading people and delivering trainings and talks to groups of 5 to 200. That's still how I run projects and trainings today.",
                role0year: '11.2026 — Present',
                role0title: 'AI Solutions Engineer',
                role0desc: 'Designing and implementing applied AI solutions for real business workflows — from automation to AI-integrated systems in production.',
                new: 'New'
            },
            scenes: {
                avatarTitle: 'Chat with AI Omer',
                projectsTitle: 'Projects',
                aiTitle: 'AI',
                hubTitle: 'AI Hub',
                hubSub: 'Videos, talks and articles on applied AI.'
            },
            projects: { more: 'More projects' },
            skills: { title: 'Technical Stack' },
            contact: {
                eyebrow: "What's next",
                title: "Let's build something together",
                lead: "Hiring, building something, or want your team to work with AI? I'd like to hear about it.",
                cta: 'Get in touch',
                resume: 'Download resume',
                call: 'Book a call',
                location: 'Petah Tikva, Israel'
            },
            footer: {
                terms: 'Terms of Use',
                privacy: 'Privacy Policy',
                accessibility: 'Accessibility Statement',
                copy: '© 2026 Omer Mandalaoui. All Rights Reserved.',
                built: 'Designed and built by Omer, AI avatar included.'
            }
        },
        he: {
            dir: 'rtl',
            logo: 'עומר מנדלאוי',
            nav: { home: 'בית', chat: 'AI Omer', projects: 'פרויקטים', ai: 'AI', about: 'אודות', skills: 'טכנולוגיות', contact: 'צור קשר' },
            hero: {
                titlePre: 'הופך',
                titlePost: 'למערכות חכמות',
                badge: 'מפתח AI ופול-סטאק · הדרכות AI',
                desc: 'מערכות ווב חכמות, אוטומציות AI ומוצרי פול-סטאק שרצים כל יום בתוך עסקים אמיתיים. אני בונה אותם, מעלה אותם לאוויר ומדריך את הצוות שלכם לעבוד איתם.',
                cta: 'לתיק העבודות',
                stage1: 'עסק', stage2: 'תוכנה', stage3: 'AI', stage4: 'הדרכה', stage5: 'השפעה',
                stage1sub: 'התהליך היום', stage2sub: 'נבנה ושוחרר', stage3sub: 'אוטומציה', stage4sub: 'הצוות מודרך', stage5sub: 'תוצאות נמדדות',
                cycle: ['רעיונות', 'תהליכים', 'גיליונות אקסל', 'צווארי בקבוק', 'עבודה ידנית'],
                chipOnline: 'זמין עכשיו', chipChat: '💬 שוחחו עם AI Omer'
            },
            about: {
                title: 'אודות',
                who: 'מי אני',
                timeline: 'השכלה וניסיון',
                headline: 'אני בונה מערכות AI שרצות בתוך עסקים אמיתיים, ומלמד צוותים לעבוד איתן.',
                bio1: 'אני מפתח AI ופול-סטאק, בוגר מדעי המחשב באוניברסיטת בר-אילן. אני עובד צמוד לעסק עצמו: מהשיחה הראשונה ועד מערכת שרצה בפרודקשן.',
                bio2: 'העבודה שלי מכסה את כל הדרך: להבין איך העסק באמת עובד, לתכנן את הפתרון, לבנות את הצד של המשתמש, את השרת ואת שילוב ה-AI, להעלות לאוויר וללמד את הצוות לעבוד עם זה. לפני ההייטק שירתתי כמעט ארבע שנים כקצין משאבי אנוש בצה"ל, הובלתי אנשים והעברתי הדרכות והרצאות לקבוצות של 5 עד 200 איש. ככה אני מנהל פרויקטים והדרכות גם היום.',
                role0year: '11.2026 — היום',
                role0title: 'AI Solutions Engineer',
                role0desc: 'מתכנן ובונה פתרונות AI יישומיים לתהליכים עסקיים אמיתיים - מאוטומציה ועד מערכות עם AI משולב שרצות בפרודקשן.',
                new: 'חדש'
            },
            scenes: {
                avatarTitle: 'שוחחו עם AI Omer',
                projectsTitle: 'פרויקטים',
                aiTitle: 'AI',
                hubTitle: 'מרכז ה-AI',
                hubSub: 'סרטונים, הרצאות ומאמרים על AI יישומי.'
            },
            projects: { more: 'פרויקטים נוספים' },
            skills: { title: 'הטכנולוגיות שלי' },
            contact: {
                eyebrow: 'מה הלאה',
                title: 'בואו נבנה משהו ביחד',
                lead: 'מגייסים, בונים משהו, או רוצים שהצוות שלכם יעבוד עם AI? אשמח לשמוע.',
                cta: 'צרו קשר',
                resume: 'הורדת קורות חיים',
                call: 'קביעת שיחה',
                location: 'פתח תקווה, ישראל'
            },
            footer: {
                terms: 'תנאי שימוש',
                privacy: 'מדיניות פרטיות',
                accessibility: 'הצהרת נגישות',
                copy: '© 2026 עומר מנדלאוי. כל הזכויות שמורות.',
                built: 'עוצב ונבנה על ידי עומר, כולל האווטאר.'
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
