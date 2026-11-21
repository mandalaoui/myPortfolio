// Reusable "zoom forward" scroll transition between two consecutive sections.
//
// The outgoing section (full-screen) is pinned for `length` viewport heights.
// Over that pinned range it scales up and fades out, while the incoming section
// (which may be taller than the screen, e.g. Projects) is held at the top of the
// viewport and scales from small to 100% while fading in. When the range ends,
// the incoming section is exactly where normal scrolling would put it, so the
// page just continues scrolling from there.
//
// Layout: the outgoing section is pinned by GSAP (its spacer adds the scroll
// distance); the incoming one is held with position: fixed for the same range
// and lands exactly in its normal place when the range ends.
//
// Runs on desktop and mobile. On touch devices GSAP's ignoreMobileResize
// keeps the pinned ranges stable when the mobile address bar shows/hides.
// Disabled (plain scroll, existing fade-ups in animations.js) only when the
// user prefers reduced motion.
//
// Usage:
//   ZoomTransition.create({ outgoing: '#projectsTitle', incoming: '#projects' });
//   ZoomTransition.refresh();            // after content above/inside changes size
//   ZoomTransition.scrollTargetFor(el);  // scroll position to land on el, or null

(function () {
    const ENABLE_QUERY = '(prefers-reduced-motion: no-preference)';

    let touchSetupDone = false;

    // Mobile stabilizers, applied once (only when transitions are enabled).
    function setupTouch() {
        if (touchSetupDone) return;
        touchSetupDone = true;
        // Don't re-measure everything when the address bar shows/hides.
        ScrollTrigger.config({ ignoreMobileResize: true });
        // Deliberately NOT using ScrollTrigger.normalizeScroll(true): it was
        // tried and it clamped scrolling short of the real page bottom on
        // mobile, so the footer could not be reached.
    }

    // How much of the outgoing section is on screen when its pin starts:
    // its full height, capped at one screen (taller sections, e.g. the Hero
    // on a phone, are pinned once their bottom reaches the bottom of the
    // screen, so all their content is seen before the zoom).
    function visiblePart(outgoing) {
        return Math.min(outgoing.offsetHeight, window.innerHeight);
    }

    const registry = [];

    function resolve(target) {
        return typeof target === 'string' ? document.querySelector(target) : target;
    }

    function create(options) {
        const {
            outgoing: outgoingTarget,
            incoming: incomingTarget,
            length = 1.2,   // pinned scroll distance, in viewport heights
            split = 0.5,    // share of the range spent on the outgoing half
            overlap = 0.1,  // how much the two halves overlap (crossfade)
            scaleOut = 1.35,
            scaleIn = 0.75
        } = options || {};

        const outgoing = resolve(outgoingTarget);
        const incoming = resolve(incomingTarget);

        if (!window.gsap || !window.ScrollTrigger || !outgoing || !incoming) {
            return null;
        }

        gsap.registerPlugin(ScrollTrigger);

        const entry = { outgoing, incoming, trigger: null };
        registry.push(entry);

        const mm = gsap.matchMedia();

        mm.add(ENABLE_QUERY, () => {
            setupTouch();

            const pinDistance = () => window.innerHeight * length;
            const viewportCenter = () => `50% ${window.innerHeight / 2}px`;
            // Screen center in the outgoing section's own coordinates (its top
            // is above the screen when it is taller than the screen).
            const outgoingCenter = () =>
                `50% ${outgoing.offsetHeight - visiblePart(outgoing) + window.innerHeight / 2}px`;
            const range = () => `+=${pinDistance()}`;

            // The outgoing pin adds `length` screens of scroll after the
            // outgoing section; pulling the incoming one up by the part of the
            // outgoing section that is on screen puts its top at the viewport
            // top exactly when the range ends, so normal scrolling continues.
            const overlay = () => {
                incoming.style.marginTop = `-${visiblePart(outgoing)}px`;
            };

            // During the range the incoming section is held at the top of the
            // viewport with plain position: fixed (composited by the browser, so
            // no jitter). Not a GSAP pin: after a GSAP pin ends the element is
            // left offset by a transform, which breaks position: sticky inside
            // it (the Projects sideways scroll). A placeholder keeps its height
            // in the flow while it is fixed.
            const holder = document.createElement('div');
            holder.setAttribute('aria-hidden', 'true');
            holder.style.display = 'none';
            incoming.parentNode.insertBefore(holder, incoming);
            let held = false;

            const hold = () => {
                if (held) return;
                // Measure the box from the placeholder (same flow slot), since the
                // incoming section itself is scaled mid-transition.
                const height = incoming.offsetHeight;
                holder.style.cssText = `display:block;height:${height}px;margin-top:-${visiblePart(outgoing)}px;`;
                Object.assign(incoming.style, {
                    position: 'fixed', top: '0px',
                    left: `${holder.getBoundingClientRect().left}px`,
                    width: `${holder.offsetWidth}px`, marginTop: '0px'
                });
                held = true;
            };

            const release = () => {
                if (!held) return;
                holder.style.cssText = 'display:none;';
                Object.assign(incoming.style, { position: 'relative', top: '', left: '', width: '' });
                overlay();
                held = false;
            };

            const onRefreshInit = () => { release(); overlay(); };

            overlay();
            ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

            incoming.style.position = 'relative';
            incoming.style.zIndex = '1';

            // scrub: true (no smoothing): the zoom state always matches the
            // scroll position exactly, in both directions.
            const tl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: outgoing,
                    start: () => (outgoing.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
                    end: range,
                    pin: true,
                    pinSpacing: true,
                    scrub: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onToggle: (self) => (self.isActive ? hold() : release()),
                    onRefresh: (self) => { if (self.isActive) hold(); }
                }
            });

            tl.fromTo(outgoing,
                { scale: 1, autoAlpha: 1, transformOrigin: outgoingCenter },
                { scale: scaleOut, autoAlpha: 0, ease: 'power1.in', duration: split },
                0);

            tl.fromTo(incoming,
                { scale: scaleIn, autoAlpha: 0, transformOrigin: viewportCenter },
                { scale: 1, autoAlpha: 1, ease: 'power2.out', duration: 1 - split + overlap },
                split - overlap);

            entry.trigger = tl.scrollTrigger;

            return () => {
                ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
                release();
                holder.remove();
                incoming.style.marginTop = '';
                incoming.style.zIndex = '';
                entry.trigger = null;
            };
        });

        return entry;
    }

    // Where to scroll so `el` is shown fully, accounting for pinned ranges:
    // an outgoing section is shown at the start of its pin, an incoming one at
    // the end. Returns null for elements not involved in a transition, so the
    // caller can fall back to normal scrollIntoView.
    function scrollTargetFor(el) {
        for (const { outgoing, incoming, trigger } of registry) {
            if (!trigger) continue;
            // Land on the top of the outgoing section (above its pin start
            // when it is taller than the screen).
            if (el === outgoing) return Math.max(0, trigger.start - (outgoing.offsetHeight - visiblePart(outgoing)));
            if (el === incoming) return trigger.end;
        }
        return null;
    }

    function refresh() {
        if (window.ScrollTrigger) ScrollTrigger.refresh();
    }

    // A deep link like /#projects lands on the browser's layout position, which
    // is wrong inside a pinned range; correct it once layout has settled
    // (page loaded + web fonts ready, since fonts change section heights).
    function fixInitialHash() {
        if (!window.location.hash) return;
        window.addEventListener('load', () => {
            const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
            // setTimeout rather than rAF: rAF never fires in a background tab.
            fontsReady.then(() => setTimeout(() => {
                if (!window.ScrollTrigger) return;
                ScrollTrigger.refresh();
                let el = null;
                try { el = document.querySelector(window.location.hash); } catch (e) { return; }
                const y = el && scrollTargetFor(el);
                if (typeof y === 'number') window.scrollTo({ top: y, behavior: 'instant' });
            }, 0));
        });
    }

    fixInitialHash();

    // Switching EN/HE changes text lengths and therefore section heights.
    document.addEventListener('langchange', refresh);

    // Scroll distance spent inside active transition ranges above `y`.
    function pausedDistance(y) {
        let total = 0;
        for (const { trigger } of registry) {
            if (!trigger) continue;
            total += Math.min(Math.max(y - trigger.start, 0), trigger.end - trigger.start);
        }
        return total;
    }

    // Background layer (.sky-bg, see styles.css): follows normal scrolling but
    // stands still during transitions, so the zoom reads as moving forward
    // rather than scrolling down. Uses transform only (compositor-friendly).
    function driveSkyBackground() {
        const sky = document.getElementById('skyBg');
        if (!sky) return;

        const update = () => {
            const tile = sky.offsetHeight * 2 / 3; // layer is 300vh, tile is 200vh
            if (!tile) return;
            const offset = window.scrollY - pausedDistance(window.scrollY);
            sky.style.transform = `translate3d(0, ${-(offset % tile)}px, 0)`;
        };

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        if (window.ScrollTrigger) ScrollTrigger.addEventListener('refresh', update);
        update();
    }

    driveSkyBackground();

    window.ZoomTransition = { create, refresh, scrollTargetFor };
})();
