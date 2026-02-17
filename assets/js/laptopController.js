(function () {
    'use strict';

    const heroModel = document.getElementById('laptopHero');
    const floatModel = document.getElementById('laptopFloat');

    // Fix: add local variable for heroModel usage (was old laptopHero in updateCamera)
    if (!heroModel && !floatModel) return;

    /* ──────────────────────────────────────────────
       STATE
    ────────────────────────────────────────────── */

    const state = {
        currentTheta: -90,
        currentPhi: 75,
        targetTheta: -90,
        targetPhi: 75,
        radius: null,
        mouseX: 0,
        mouseY: 0,
        mouseInfluence: 0.4,
        smoothing: 0.08,
        followMouse: false
    };

    /* ──────────────────────────────────────────────
       UTILS
    ────────────────────────────────────────────── */

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    function updateCamera() {
        if (heroModel) {
            heroModel.setAttribute(
                'camera-orbit',
                `${state.currentTheta}deg ${state.currentPhi}deg ${state.radius || 'auto'}`
            );
        }
    }

    function updateFloatCamera() {
        if (floatModel) {
            const orbit = `${state.currentTheta}deg ${state.currentPhi}deg auto`;
            floatModel.setAttribute('camera-orbit', orbit);
        }
    }

    /* ──────────────────────────────────────────────
       ANIMATION LOOP
    ────────────────────────────────────────────── */

    function animate() {
        // Only call requestAnimationFrame once
        if (heroModel) {
            // No interpolation: jump directly to target values (no delay)
            state.currentTheta = state.targetTheta;
            state.currentPhi = state.targetPhi;

            if (state.followMouse) {
                const maxTilt = 20;
                const mouseTheta = state.mouseX * maxTilt * state.mouseInfluence;
                const mousePhi = -state.mouseY * maxTilt * state.mouseInfluence;

                state.currentTheta += mouseTheta * 0.05;
                state.currentPhi += mousePhi * 0.05;
            }

            updateCamera();
        }

        // Only float follows mouse, only animate once per frame
        if (floatModel) {
            const maxTilt = 50;
            const theta = -20 - state.mouseX * maxTilt;
            const phi = 75 - state.mouseY * 10;

            floatModel.setAttribute(
                'camera-orbit',
                `${theta}deg ${phi}deg auto`
            );
        }

        requestAnimationFrame(animate);
    }

    /* ──────────────────────────────────────────────
       PUBLIC API
    ────────────────────────────────────────────── */

    window.LaptopController = {

        rotateTo(thetaDeg, phiDeg = 75) {
            state.targetTheta = thetaDeg;
            state.targetPhi = clamp(phiDeg, 30, 90);
        },

        setRadius(radius) {
            state.radius = radius;
        },

        enableMouseFollow(intensity = 0.4) {
            state.followMouse = true;
            state.mouseInfluence = intensity;
        },

        disableMouseFollow() {
            state.followMouse = false;
        }
    };

    /* ──────────────────────────────────────────────
       MOUSE LISTENER
    ────────────────────────────────────────────── */

    window.addEventListener('mousemove', (e) => {
        state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        state.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    /* ──────────────────────────────────────────────
       START
    ────────────────────────────────────────────── */

    animate();

})();
