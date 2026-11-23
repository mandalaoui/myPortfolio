// AI Omer: animated avatar + chat (server: netlify/functions/chat.mjs).
//
// Avatar: stacked pose images; one is visible at a time.
//   idle (breathing via CSS), blink every few seconds, wave when the section
//   first appears, thinking while waiting for an answer, explain + talking
//   (idle <-> talk mouth frames) while the answer streams in, and a
//   "suspicious" look (raised eyebrow, crossed arms + shake) for manipulative
//   requests.
// Chat: suggested questions, streamed answers, source chips that scroll to the
//   matching section, call-to-action buttons for potential clients/employers.
// Language: English / Hebrew, follows the site's language toggle.

(function () {
    const section = document.getElementById('avatar');
    const figure = document.getElementById('avatarFigure');
    const stage = document.getElementById('avatarStage');
    const list = document.getElementById('chatMessages');
    const suggestionsBox = document.getElementById('chatSuggestions');
    const cta = document.getElementById('chatCta');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    if (!section || !figure || !list || !form) return;

    const STRINGS = {
        en: {
            title: 'Chat with AI Omer',
            greeting: "Hi! I'm Omer's AI avatar. Ask me about my projects, experience, how I can help your business, or how to get started with AI.",
            placeholder: 'Ask me anything about my work…',
            send: 'Send',
            book: 'Book a call',
            sources: 'Based on',
            howTitle: 'How this chat works',
            howText: "It's a small RAG system: your question is rewritten into search terms, the most relevant facts about me are retrieved from a knowledge base, and an LLM (on Groq) answers only from those facts. A separate model screens messages for prompt-injection attempts.",
            // [text before, link text (-> #contact), text after]
            privacy: ['Answers are AI-generated and may contain errors. They are not a binding commitment or professional advice; please ', 'confirm anything important with me directly', ". Conversations are saved to improve the answers, so please don't share sensitive information."],
            error: "Sorry, I can't answer right now. You can reach me directly through the contact options at the bottom of the site.",
            suggestions: ['What have you built with AI?', 'Are you available for projects?', 'Do you run AI trainings?', 'How do I start using AI in my business?'],
            // Chat states (fixed texts, no AI call)
            unavailable: 'The chat is unavailable right now',
            nearQuota: 'The chat is busy today, so it may only be available for a little longer.',
            quotaTitle: "The chat has reached today's limit",
            quotaText: "It will be back {when}. Meanwhile, I'd love to hear from you directly:",
            busyTitle: 'Lots of questions right now',
            busyText: 'The chat will be available again in {time}.',
            blockedTitle: 'The chat is locked for 24 hours',
            blockedText: 'This happens after repeated unusual requests. It reopens {when}. You can still reach me directly:',
            disabledTitle: "The chat isn't available right now",
            disabledText: "I'd love to hear from you directly:",
            errorTitle: 'Something went wrong',
            errorText: "The chat couldn't connect. Please try again.",
            retry: 'Try again',
            email: 'Email',
            seconds: 'seconds',
            oneSecond: '1 second',
            today: 'today at {t}',
            tomorrow: 'tomorrow at {t}',
            on: 'on {d} at {t}'
        },
        he: {
            title: 'שיחה עם AI Omer',
            greeting: 'היי! אני האווטאר של עומר. אפשר לשאול אותי על הפרויקטים, על הניסיון שלי, על איך אני יכול לעזור לעסק שלך, או איך להתחיל לעבוד עם AI.',
            placeholder: 'שאלו אותי על העבודה שלי…',
            send: 'שליחה',
            book: 'קביעת שיחה',
            sources: 'מבוסס על',
            howTitle: 'איך הצ\'אט הזה עובד',
            howText: 'זו מערכת RAG קטנה: השאלה שלכם מנוסחת מחדש למילות חיפוש, המידע הרלוונטי עליי נשלף ממאגר ידע, ומודל שפה (ב-Groq) עונה רק מתוך המידע הזה. מודל נוסף בודק כל הודעה מפני ניסיונות prompt injection.',
            privacy: ['התשובות נוצרות באמצעות בינה מלאכותית ועשויות לכלול טעויות. הן אינן מהוות התחייבות או ייעוץ מקצועי, ולכל עניין מהותי מומלץ ', 'לאמת מולי ישירות', '. השיחות נשמרות לצורך שיפור התשובות, ולכן אין לשתף מידע רגיש.'],
            error: 'סליחה, אני לא יכול לענות כרגע. אפשר לפנות אליי ישירות דרך פרטי הקשר בתחתית האתר.',
            suggestions: ['מה בנית עם AI?', 'אתה פנוי לפרויקטים?', 'אתה מעביר הדרכות AI?', 'איך מתחילים לעבוד עם AI בעסק?'],
            unavailable: 'הצ\'אט לא זמין כרגע',
            nearQuota: 'הצ\'אט עמוס היום, ולכן ייתכן שיהיה זמין רק לזמן קצר.',
            quotaTitle: 'הצ\'אט הגיע למכסה היומית',
            quotaText: 'הוא יחזור {when}. בינתיים אשמח לשמוע ממך ישירות:',
            busyTitle: 'יש הרבה פניות כרגע',
            busyText: 'הצ\'אט יחזור לפעול בעוד {time}.',
            blockedTitle: 'הצ\'אט ננעל ל-24 שעות',
            blockedText: 'זה קורה אחרי בקשות חריגות חוזרות. הוא ייפתח {when}. עדיין אפשר לפנות אליי ישירות:',
            disabledTitle: 'הצ\'אט לא זמין כרגע',
            disabledText: 'אשמח לשמוע ממך ישירות:',
            errorTitle: 'משהו השתבש',
            errorText: 'לא הצלחנו להתחבר לצ\'אט. נסו שוב.',
            retry: 'נסו שוב',
            email: 'מייל',
            seconds: 'שניות',
            oneSecond: 'שנייה',
            today: 'היום ב-{t}',
            tomorrow: 'מחר ב-{t}',
            on: 'ב-{d} בשעה {t}'
        }
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lang = () => (window.I18n && window.I18n.current === 'he' ? 'he' : 'en');
    const t = (key) => STRINGS[lang()][key];

    // ── Avatar ───────────────────────────────────────────────────
    const poses = {};
    figure.querySelectorAll('.avatar-pose').forEach((img) => { poses[img.dataset.pose] = img; });
    let pose = 'idle';
    let mode = 'idle';          // idle | thinking | talking | suspicious | wave
    let talkTimer = 0;
    let blinkTimer = 0;
    let modeTimer = 0;

    // Mouth/eye frames of the base pose: swapped silently. Anything else is a
    // gesture change and gets a quick pop (see .avatar-pose.pop in CSS).
    const FACE_FRAMES = new Set(['idle', 'blink', 'talk']);

    function show(name) {
        if (!poses[name] || name === pose) return;
        const gesture = !(FACE_FRAMES.has(name) && FACE_FRAMES.has(pose));
        poses[pose].classList.remove('on', 'pop');
        poses[name].classList.add('on');
        if (gesture) {
            poses[name].classList.remove('pop');
            void poses[name].offsetWidth;      // restart the animation
            poses[name].classList.add('pop');
        }
        pose = name;
    }

    // hold: keep waving until something else ends it (used while arriving).
    function setMode(next, hold = false) {
        mode = next;
        clearInterval(talkTimer);
        clearTimeout(modeTimer);
        figure.classList.toggle('is-suspicious', next === 'suspicious');
        figure.classList.toggle('is-thinking', next === 'thinking');
        if (next === 'idle') show('idle');
        if (next === 'thinking') show('thinking');
        if (next === 'suspicious') show(poses.suspicious ? 'suspicious' : 'thinking');
        if (next === 'wave') {
            show('wave');
            if (!hold) modeTimer = setTimeout(() => setMode('idle'), 1800);
        }
        if (next === 'talking') {
            // Open with a gesture, then move the mouth while text streams in.
            show(Math.random() < 0.5 ? 'explain' : 'explain-open');
            modeTimer = setTimeout(() => {
                let open = false;
                talkTimer = setInterval(() => {
                    open = !open && Math.random() > 0.15;
                    show(open ? 'talk' : 'idle');
                }, 130 + Math.random() * 60);
            }, 900);
        }
    }

    function scheduleBlink() {
        blinkTimer = setTimeout(() => {
            if (mode === 'idle' && pose === 'idle') {
                show('blink');
                setTimeout(() => { if (pose === 'blink') show('idle'); }, 140);
            }
            scheduleBlink();
        }, 2500 + Math.random() * 3500);
    }
    scheduleBlink();

    // Wave rules (scrolling in either direction):
    //   Visibility = share of the avatar on screen x how faded-in the section is
    //   (during the Hero -> avatar zoom the section is on screen but still fading in).
    //   Arriving: wave from the first visible moment, keep waving until the avatar is
    //             fully visible, then a little longer (ARRIVE_TAIL), then idle.
    //   Leaving:  once it has been fully visible, wave as soon as visibility drops
    //             below 80%.
    //   Never interrupts a chat answer (thinking / talking / suspicious).
    const ARRIVE_TAIL = 900;     // ms of waving after reaching full visibility
    const LEAVE_AT = 0.8;
    let prevVis = 0;
    let waveReason = null;       // 'arrive' | 'leave' | null
    let armedLeave = false;      // set once fully visible
    let tailTimer = 0;
    let followUp = 0;

    // The fixed navbar covers the top of the screen, so the visible area starts
    // below it (it may slide away on scroll; its current bottom edge is used).
    // (#mainNavbar itself is a static 0-height wrapper; the fixed bar is its <nav>.)
    const navbar = document.querySelector('#mainNavbar nav') || document.getElementById('mainNavbar');

    function visibility() {
        const r = stage.getBoundingClientRect();
        const top = navbar ? Math.max(0, navbar.getBoundingClientRect().bottom) : 0;
        const shown = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, top)) / (r.height || 1);
        const opacity = parseFloat(getComputedStyle(section).opacity) || 0;
        return Math.max(0, Math.min(1, shown * opacity));
    }

    function wave(reason, hold) {
        waveReason = reason;
        setMode('wave', hold);
    }

    function checkView() {
        clearTimeout(followUp);
        const vis = visibility();
        const free = mode === 'idle' || mode === 'wave';
        if (mode !== 'wave') waveReason = null;

        // Arriving: first visible moment -> start a held wave.
        if (prevVis <= 0.01 && vis > 0.01 && free) wave('arrive', true);

        if (vis >= 0.98) {
            armedLeave = true;
            // Fully visible: finish the arrival wave a little later.
            if (waveReason === 'arrive' && !tailTimer) {
                tailTimer = setTimeout(() => {
                    tailTimer = 0;
                    if (mode === 'wave' && waveReason === 'arrive') setMode('idle');
                }, ARRIVE_TAIL);
            }
        } else if (tailTimer && waveReason === 'arrive') {
            clearTimeout(tailTimer);      // not fully visible anymore: keep holding
            tailTimer = 0;
        }

        // Leaving: dropped below 80% after having been fully visible.
        if (armedLeave && prevVis >= LEAVE_AT && vis < LEAVE_AT) {
            armedLeave = false;
            if (free) wave('leave', false);
        }

        // Gone: reset so the next arrival waves again.
        if (vis <= 0.01) {
            armedLeave = false;
            if (waveReason === 'arrive' && mode === 'wave') setMode('idle');
        }

        // The zoom fade is applied by GSAP just after the scroll event, so keep
        // re-checking shortly while visibility is still changing.
        const changing = Math.abs(vis - prevVis) > 0.002;
        prevVis = vis;
        followUp = setTimeout(checkView, changing ? 40 : 160);
        if (!changing) { clearTimeout(followUp); followUp = 0; }
    }

    // Checked on every scroll (cheap: one rect + one computed style).
    window.addEventListener('scroll', checkView, { passive: true });
    window.addEventListener('resize', checkView);
    checkView();

    // Slight 3D tilt toward the pointer (desktop, motion allowed).
    stage.addEventListener('pointermove', (e) => {
        if (reducedMotion.matches || e.pointerType !== 'mouse') return;
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        figure.style.setProperty('--tilt-x', `${(-y * 6).toFixed(2)}deg`);
        figure.style.setProperty('--tilt-y', `${(x * 8).toFixed(2)}deg`);
    });
    stage.addEventListener('pointerleave', () => {
        figure.style.setProperty('--tilt-x', '0deg');
        figure.style.setProperty('--tilt-y', '0deg');
    });

    // ── Chat ─────────────────────────────────────────────────────
    // Chat states (see SECURITY_PLAN.md 2.5). The page asks /api/chat/status
    // before the visitor types, so every limitation is shown up front with a
    // fixed message (no AI call): available (+ "near quota" note), busy (with
    // countdown), quota, blocked, disabled, error (with retry).
    const statusBox = document.getElementById('chatStatus');
    const nearNote = document.getElementById('chatNear');
    const honeypot = document.getElementById('chatHp');
    const CONTACT = {
        book: 'https://calendar.app.google/BzQ4bsv9qHKrsKKb7',
        whatsapp: 'https://wa.me/972538228882',
        email: 'mailto:mandalaoui.omer@gmail.com'
    };
    const TOKEN_REFRESH_MS = 50 * 60 * 1000;   // tokens are valid for 1 hour
    const history = [];
    let busy = false;
    let chatState = 'available';
    let stateInfo = {};
    let token = null;
    let lastStatusAt = 0;
    let countdownTimer = 0;

    // Anonymous browser id (random; no personal data), used for usage limits.
    const clientId = (() => {
        const KEY = 'chat-client';
        const fresh = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID()
            : `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`);
        try {
            let id = localStorage.getItem(KEY);
            if (!/^[A-Za-z0-9-]{8,64}$/.test(id || '')) { id = fresh(); localStorage.setItem(KEY, id); }
            return id;
        } catch (e) {
            return fresh();
        }
    })();

    function addMessage(role, text) {
        const el = document.createElement('div');
        el.className = `chat-msg chat-msg-${role}`;
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = text;
        el.appendChild(bubble);
        list.appendChild(el);
        list.scrollTop = list.scrollHeight;
        return el;
    }

    // In-page links added by this script (navigation.js only wires links that
    // exist at load). Sections inside a zoom transition need its landing point.
    function scrollToSection(e, href) {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const y = window.ZoomTransition && window.ZoomTransition.scrollTargetFor(target);
        if (typeof y === 'number') window.scrollTo({ top: y, behavior: 'smooth' });
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function addSources(el, sources) {
        if (!sources || !sources.length) return;
        const row = document.createElement('div');
        row.className = 'chat-sources';
        const label = document.createElement('span');
        label.textContent = `${t('sources')}:`;
        row.appendChild(label);
        sources.forEach((s) => {
            const a = document.createElement('a');
            a.href = s.href;
            a.textContent = s.title;
            a.addEventListener('click', (e) => scrollToSection(e, s.href));
            row.appendChild(a);
        });
        el.appendChild(row);
    }

    function renderSuggestions() {
        suggestionsBox.innerHTML = '';
        if (history.length || chatState !== 'available') return;   // only before the first question
        t('suggestions').forEach((q) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = q;
            b.addEventListener('click', () => ask(q));
            suggestionsBox.appendChild(b);
        });
    }

    // ── Status card ──────────────────────────────────────────────
    function formatWhen(ts) {
        const locale = lang() === 'he' ? 'he-IL' : 'en-GB';
        const d = new Date(ts);
        const time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        const today = new Date();
        const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
        const same = (a, b) => a.toDateString() === b.toDateString();
        if (same(d, today)) return t('today').replace('{t}', time);
        if (same(d, tomorrow)) return t('tomorrow').replace('{t}', time);
        return t('on').replace('{d}', d.toLocaleDateString(locale, { day: 'numeric', month: 'long' })).replace('{t}', time);
    }

    function formatCountdown(ms) {
        const total = Math.max(0, Math.ceil(ms / 1000));
        const m = Math.floor(total / 60);
        const s = String(total % 60).padStart(2, '0');
        if (m) return `${m}:${s}`;
        return total === 1 ? t('oneSecond') : `${total} ${t('seconds')}`;
    }

    function statusButton(kind) {
        if (kind === 'retry') {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'contact-btn contact-btn-primary';
            b.innerHTML = '<i class="fas fa-rotate-right" aria-hidden="true"></i>';
            b.append(` ${t('retry')}`);
            b.addEventListener('click', () => refreshStatus());
            return b;
        }
        const a = document.createElement('a');
        a.className = `contact-btn ${kind === 'book' ? 'contact-btn-primary' : 'contact-btn-secondary'}`;
        a.href = CONTACT[kind];
        if (kind !== 'email') { a.target = '_blank'; a.rel = 'noopener'; }
        const icon = { book: 'fas fa-calendar-check', whatsapp: 'fab fa-whatsapp', email: 'fas fa-envelope' }[kind];
        a.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
        a.append(` ${kind === 'book' ? t('book') : kind === 'whatsapp' ? 'WhatsApp' : t('email')}`);
        return a;
    }

    function renderStatus(state, info) {
        const title = statusBox.querySelector('.chat-status-title');
        const text = statusBox.querySelector('.chat-status-text');
        const actions = statusBox.querySelector('.chat-status-actions');
        const contacts = ['book', 'whatsapp', 'email'];
        const map = {
            quota: [t('quotaTitle'), t('quotaText').replace('{when}', formatWhen(info.resetAt)), contacts],
            blocked: [t('blockedTitle'), t('blockedText').replace('{when}', formatWhen(info.until)), contacts],
            disabled: [t('disabledTitle'), t('disabledText'), contacts],
            busy: [t('busyTitle'), t('busyText').replace('{time}', formatCountdown((info.retryAt || 0) - Date.now())), ['book', 'whatsapp']],
            error: [t('errorTitle'), t('errorText'), ['retry', 'book']]
        }[state];
        if (!map) return;
        statusBox.dataset.state = state;
        title.textContent = map[0];
        text.textContent = map[1];
        actions.replaceChildren(...map[2].map(statusButton));
        statusBox.hidden = false;
    }

    function applyState(state, info = {}) {
        chatState = state;
        stateInfo = info;
        clearInterval(countdownTimer);
        // Typing stays possible on "error" (sending retries the connection).
        const locked = !(state === 'available' || state === 'error');
        input.disabled = locked;
        sendBtn.disabled = locked || busy;
        input.placeholder = locked ? t('unavailable') : t('placeholder');
        nearNote.textContent = t('nearQuota');
        nearNote.hidden = !(state === 'available' && info.near);
        if (state === 'available') {
            statusBox.hidden = true;
        } else {
            renderStatus(state, info);
        }
        renderSuggestions();
        try {
            if (state === 'blocked') localStorage.setItem('chat-blocked-until', String(info.until));
            else localStorage.removeItem('chat-blocked-until');
        } catch (e) { /* ignore */ }
        if (state === 'busy') {
            countdownTimer = setInterval(() => {
                if (Date.now() >= (info.retryAt || 0)) { clearInterval(countdownTimer); refreshStatus(); }
                else renderStatus('busy', info);
            }, 1000);
        }
    }

    async function refreshStatus() {
        try {
            const res = await fetch(`/api/chat/status?client=${encodeURIComponent(clientId)}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(String(res.status));
            const s = await res.json();
            lastStatusAt = Date.now();
            token = s.token || null;
            applyState(s.state, s);
        } catch (e) {
            token = null;
            applyState('error');
        }
    }

    function applyLanguage() {
        section.querySelector('.chat-title').textContent = t('title');
        sendBtn.setAttribute('aria-label', t('send'));
        section.querySelectorAll('[data-chat]').forEach((el) => {
            const value = t(el.dataset.chat);
            if (!Array.isArray(value)) { el.textContent = value; return; }
            // [before, link text, after]: the middle part links to the contact section.
            const link = document.createElement('a');
            link.href = '#contact';
            link.textContent = value[1];
            link.addEventListener('click', (e) => scrollToSection(e, '#contact'));
            el.replaceChildren(value[0], link, value[2]);
        });
        const greeting = list.querySelector('.chat-msg-greeting .chat-bubble');
        if (greeting) greeting.textContent = t('greeting');
        applyState(chatState, stateInfo);   // re-render the status card / placeholder in the new language
    }

    // Reads the streamed answer. Returns { meta, answer } or throws.
    async function post(message, retried = false) {
        if (!token || Date.now() - lastStatusAt > TOKEN_REFRESH_MS) await refreshStatus();
        if (chatState !== 'available') return { meta: null, answer: '', stopped: true };
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message, history: history.slice(-6), client: clientId, token,
                hp: honeypot ? honeypot.value : ''
            })
        });
        if (res.status === 401 && !retried) {      // token expired or missing: renew once
            token = null;
            return post(message, true);
        }
        if (!res.ok || !res.body) throw new Error(String(res.status));
        return { res };
    }

    async function ask(text) {
        const message = text.trim().slice(0, 500);
        if (!message || busy || !(chatState === 'available' || chatState === 'error')) return;
        busy = true;
        sendBtn.disabled = true;

        let result;
        try {
            result = await post(message);
        } catch (e) {
            result = { error: true };
        }
        if (result.stopped) {          // the status check showed a limitation: card is already shown
            busy = false;
            return;
        }

        input.value = '';
        addMessage('user', message);
        suggestionsBox.innerHTML = '';
        setMode('thinking');
        const botEl = addMessage('bot', '');
        const bubble = botEl.querySelector('.chat-bubble');
        bubble.classList.add('is-typing');
        let answer = '';
        let meta = null;

        try {
            if (result.error) throw new Error('send');
            const reader = result.res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            for (;;) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();
                for (const line of lines) {
                    if (!line.trim()) continue;
                    const ev = JSON.parse(line);
                    if (ev.t === 'meta') {
                        meta = ev;
                        if (ev.state === 'suspicious' || ev.state === 'blocked') setMode('suspicious');
                        if (ev.warning) botEl.classList.add('chat-msg-warning');
                    } else if (ev.t === 'd') {
                        if (!answer && mode !== 'suspicious') setMode('talking');
                        bubble.classList.remove('is-typing');
                        answer += ev.v;
                        bubble.textContent = answer;
                        list.scrollTop = list.scrollHeight;
                    } else if (ev.t === 'reset') {      // output filter replaced the answer
                        answer = ev.v;
                        bubble.textContent = answer;
                    }
                }
            }
        } catch (err) {
            answer = t('error');
            bubble.textContent = answer;
            meta = { cta: true, sources: [] };
            applyState('error');
        }

        bubble.classList.remove('is-typing');
        if (meta) {
            addSources(botEl, meta.sources);
            if (meta.cta) cta.hidden = false;
            if (['blocked', 'quota', 'busy', 'disabled'].includes(meta.state)) {
                applyState(meta.state, meta);   // the limitation applies from now on
            } else if (chatState === 'available' && meta.near) {
                nearNote.hidden = false;
            }
        }
        history.push({ role: 'user', content: message }, { role: 'assistant', content: answer });

        // Suspicious look lingers a moment, then back to normal.
        clearTimeout(modeTimer);
        modeTimer = setTimeout(() => setMode('idle'), mode === 'suspicious' ? 2600 : 700);
        busy = false;
        sendBtn.disabled = !(chatState === 'available' || chatState === 'error');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        ask(input.value);
    });

    // Re-check when the visitor comes back to the tab after a while.
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && Date.now() - lastStatusAt > 2 * 60 * 1000) refreshStatus();
    });

    const greeting = addMessage('bot', '');
    greeting.classList.add('chat-msg-greeting');
    // Show a known block immediately (before the status answer arrives).
    try {
        const until = Number(localStorage.getItem('chat-blocked-until'));
        if (until > Date.now()) chatState = 'blocked', stateInfo = { until };
    } catch (e) { /* ignore */ }
    applyLanguage();
    document.addEventListener('langchange', applyLanguage);
    refreshStatus();
})();
