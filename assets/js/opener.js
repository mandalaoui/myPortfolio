
// Step 1: Disable native scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Step 2: Force scroll position 0 on normal (not hash) load
window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});

(function () {
    'use strict';

    // ─── Config ───────────────────────────────────────────────────────────────
    const CONFIG = {
        animationHeightMultiplier: 2,
        progressLerpFactor: 0.1,
        maxLaptopScale: 10, // new: max scale for the laptop pop/zoom
    };

    // ─── Cached DOM refs ──────────────────────────────────────────────────────
    const el = {
        terminal:      document.querySelector('.terminal-wrapper'),
        laptopContainer: document.querySelector('.laptop-container'),
        scrollIndicator: document.querySelector('.scroll-indicator'),
        progressBar:     document.querySelector('.progress-bar'),
        navbar:          document.getElementById('mainNavbar'),
        mainContent:     document.getElementById('mainContent'),
        laptopModel:     document.getElementById('laptopModel'),
        laptopFloat:     document.getElementById('laptopFloat'),
        whatsappFloat:     document.getElementById('whatsappFloat'),
        scrollContainer:     document.getElementById('scrollContainer'),
        cornerTL: document.getElementById('corner-tl'),
        cornerTR: document.getElementById('corner-tr'),
        cornerBL: document.getElementById('corner-bl'),
        cornerBR: document.getElementById('corner-br'),
        canvasContainer: document.querySelector('.canvas-container'),

    };

    // ─── Helpers ──────────────────────────────────────────────────────────────
    const clamp      = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const lerp       = (a, b, t) => a + (b - a) * t;
    const easeInOut  = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const rangeProg  = (p, start, end) => easeInOut(clamp((p - start) / (end - start)));

    function getAnimationDistance() {
        return CONFIG.animationHeightMultiplier * window.innerHeight;
    }

    const s1 = 0;
    const s2 = 0.4;
    const s3 = 0.8;
    const s4 = 0.98;

    // Step 3: Skip opener only if needed
    const hasHash = window.location.hash && window.location.hash.length > 0;
    const cameFromNavigation = performance.getEntriesByType("navigation")[0]?.type === "reload";

    if (hasHash) {
        document.body.classList.add("skip-opener");
        if (el.scrollContainer) {
            el.scrollContainer.style.display = "none";
        }
    }
    // (No else! — the opener only skips if there’s a hash.)

    function computeState(progress) {
        // Default initial state
        const state = {
            progressBarWidth: progress * 100,
            hello: {
                opacity: 1,
                transform: `translate(-50%, -50%) scale(0.4)`,
            },
            laptop: {
                opacity: 1,
                transform: `perspective(2000px) translate(50vw, -50%) translateX(-50%) scale(1)`,
            },
            uiVisible: false,
        };
        if (progress < s2) {
            // Phase 1: hello moves from 50vw->75vw, laptop from -50vw->25vw
            const t = rangeProg(progress, s1, s2);
            const helloX = lerp(50, 75, t);
            const laptopX = lerp(-50, 25, t);
            state.hello.transform = `translate3d(${helloX}vw, -50%, 0) translateX(-50%)`;
            state.laptop.transform = `perspective(2000px) translate(${laptopX}vw, -50%) translateX(-50%) scale(1)`;
            state.laptop.opacity = lerp(0, 1, t); 

        } else if (progress < s3) {
            // Phase 2: hello moves from 75vw->100vw (fade out), laptop 25vw->50vw
            const t = rangeProg(progress, s2, s3);
            if (window.LaptopController) {
                const theta = lerp(-90, 0, t); // מסיבוב צדדי למבט קדמי
                window.LaptopController.rotateTo(theta);
            }
            const helloX = lerp(75, 100, t);
            const laptopX = lerp(25, 50, t);
            state.hello.transform = `translate3d(${helloX}vw, -50%, 0) translateX(-50%)`;
            state.hello.opacity = lerp(1, 0, t);
            state.laptop.transform = `perspective(2000px) translate(${laptopX}vw, -50%) translateX(-50%) scale(1)`;
        } else if (progress < s4) {
            // Laptop zoom/scale up, fade out at end
            const t = clamp((progress - s3) / (s4 - s3));          
            const scale = 1 + (CONFIG.maxLaptopScale - 1) * t;
            // Fade laptop at the last 10% of this zoom
            const laptopAlpha = t > 0.9 ? (1 - (t - 0.9) / 0.1) : 1;
            state.hello.opacity = 0;
            state.laptop.opacity = Math.max(0, laptopAlpha);
            // To zoom to the top area: move Y much further upward (e.g., -50% -> -150%)
            const yOffset = lerp(-50, 10, t);
            state.laptop.transform = `perspective(2000px) translate(50vw, ${yOffset}%) translateX(-50%) scale(${scale})`;
            state.hello.transform = `translate3d(100vw, -50%, 0) translateX(-50%)`;
            state.scrollIndicatorOpacity = 0;

        } else {
            // Reveal UI, hide laptop, and hide scroll-container
            state.hello.opacity = 0;
            state.laptop.opacity = 0;
            state.laptop.transform = `perspective(2000px) translate(50vw, -85%) translateX(-50%) scale(${CONFIG.maxLaptopScale})`;
            state.hello.transform = `translate3d(100vw, -50%, 0) translateX(-50%)`;
            state.scrollIndicatorOpacity = 0;
            state.uiVisible = true;
        }
        return state;
    }


    // ─── Apply state to DOM ───────────────────────────────────────────────────
    function applyState(state) {
        if (el.scrollContainer) {
            el.scrollContainer.style.opacity = '1';
            // el.scrollContainer.style.display = state.scrollContainerDisplay;
        }
        
        if (el.progressBar)
            el.progressBar.style.width = `${state.progressBarWidth}%`;

        if (el.terminal) {
            el.terminal.style.opacity   = state.hello.opacity;
            el.terminal.style.transform = state.hello.transform;
        }

        if (el.laptopContainer) {
            el.laptopContainer.style.opacity = state.laptop.opacity;
            el.laptopContainer.style.transform = state.laptop.transform;
        }

        if (el.scrollIndicator)
            el.scrollIndicator.style.opacity = state.scrollIndicatorOpacity;

        if (el.navbar)
            el.navbar.style.opacity = state.uiVisible ? '1' : '0';

        if (el.mainContent)
            el.mainContent.style.opacity = state.uiVisible ? '1' : '0';

        if (el.laptopFloat)
            el.laptopFloat.style.opacity = state.uiVisible ? '1' : '0';

        if (el.whatsappFloat)
            el.whatsappFloat.style.opacity = state.uiVisible ? '1' : '0';

        if (el.cornerTL) el.cornerTL.style.opacity = state.uiVisible ? '1' : '0';
        if (el.cornerTR) el.cornerTR.style.opacity = state.uiVisible ? '1' : '0';
        if (el.cornerBL) el.cornerBL.style.opacity = state.uiVisible ? '1' : '0';
        if (el.cornerBR) el.cornerBR.style.opacity = state.uiVisible ? '1' : '0';

        if (el.canvasContainer) {
            if (state.uiVisible) {
                el.canvasContainer.style.pointerEvents = 'none';
                el.canvasContainer.style.zIndex = '-1';
            } else {
                el.canvasContainer.style.pointerEvents = 'auto';
                el.canvasContainer.style.zIndex = '5';
            }
        }
    }

    // ─── Smoothed scroll loop ─────────────────────────────────────────────────
    let smoothedProgress = 0;
    let rafId = null;

    function tick() {
        if (!document.body.classList.contains('skip-opener')) {
            const distance    = getAnimationDistance();
            const rawProgress = distance > 0 ? clamp(window.scrollY / distance) : 0;

            smoothedProgress += (rawProgress - smoothedProgress) * CONFIG.progressLerpFactor;

            // Snap to raw when very close to avoid infinite crawl
            if (Math.abs(rawProgress - smoothedProgress) < 0.0005)
                smoothedProgress = rawProgress;

            const state = computeState(smoothedProgress);
            applyState(state);
        }
        rafId = requestAnimationFrame(tick);
    }

    tick(); // Start continuous loop

})();
