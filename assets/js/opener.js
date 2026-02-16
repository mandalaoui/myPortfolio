(function () {
    const helloWorld = document.querySelector('.hello-world');
    const laptopContainer = document.querySelector('.laptop-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const progressBar = document.querySelector('.progress-bar');
    const scrollContainer = document.querySelector('.scroll-container'); // was missing: required for scroll calculations

    function updateScene() {
        // Ensure up-to-date totalHeight
        const animationDistance = 2 * window.innerHeight;
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / animationDistance, 1);
        
        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }

        // Section bounds
        const s1 = 0.2;
        const s2 = 0.4;
        const s3 = 0.6;
        const s4 = 1;

        // Helper functions
        const clamp = (v) => Math.max(0, Math.min(1, v));
        const ease = (t) => {
            t = clamp(t);
            return 1 - Math.pow(1 - t, 3);
        };

        // Reset visuals
        if (helloWorld) helloWorld.style.opacity = 0;
        if (laptopContainer) laptopContainer.style.opacity = 0;

        // State variables for debugging/logic
        let currentHelloX = 0, currentHelloOpacity = 0;
        let currentLaptopX = 0, currentLaptopOpacity = 0, currentLaptopScale = 1, currentLaptopRotateY = 0;
        let currentHelloTransform = '', currentLaptopTransform = '';

        // ===============================
        // SECTION 1 — HELLO CENTER
        // ===============================
        // Always hide navigation during the opener sections (before s4)
        const navbar = document.getElementById('mainNavbar');
        const mainContent = document.getElementById('mainContent');
        if (navbar) navbar.style.opacity = '0';
        if (mainContent) mainContent.style.opacity = '0';

        if (progress < s1) {
            if (navbar) navbar.style.opacity = '0';
            if (mainContent) mainContent.style.opacity = '0';

            currentHelloX = -50;
            currentHelloOpacity = 1;
            currentLaptopX = -120;
            currentLaptopOpacity = 1;
            currentLaptopScale = 1;
            currentLaptopRotateY = 180;
            currentHelloTransform = `translate(-50%, -50%) scale(1)`;
            currentLaptopTransform = `translate(-120vw, -50%) scale(1)`;

            if (helloWorld) {
                helloWorld.style.opacity = currentHelloOpacity;
                helloWorld.style.transform = currentHelloTransform;
            }
            if (laptopContainer) {
                laptopContainer.style.opacity = currentLaptopOpacity;
                laptopContainer.style.transform = currentLaptopTransform;
            }
            if (scrollIndicator) scrollIndicator.style.opacity = 1;
        }

        // ===============================
        // TRANSITION 1 → 2 (hello/laptop split sides)
        // ===============================
        else if (progress < s2) {
            if (navbar) navbar.style.opacity = '0';
            if (mainContent) mainContent.style.opacity = '0';

            const t = ease((progress - s1) / (s2 - s1));
            currentHelloX = 25 * t;
            currentHelloOpacity = 1;
            currentHelloTransform = `translate(${currentHelloX}vw, -50%) translateX(-50%)`;

            currentLaptopX = 10 * t;
            currentLaptopOpacity = 1;
            currentLaptopScale = 1;
            currentLaptopTransform = `translate(${currentLaptopX}vw, -50%) scale(1)`;

            if (helloWorld) {
                helloWorld.style.opacity = currentHelloOpacity;
                helloWorld.style.transform = currentHelloTransform;
            }
            if (laptopContainer) {
                laptopContainer.style.opacity = currentLaptopOpacity;
                laptopContainer.style.transform = currentLaptopTransform;
            }
            if (scrollIndicator) scrollIndicator.style.opacity = 0;
        }

        // ===============================
        // TRANSITION 2 → 3 (hello exits, laptop moves/rotates)
        // ===============================
        else if (progress < s3) {
            if (navbar) navbar.style.opacity = '0';
            if (mainContent) mainContent.style.opacity = '0';

            const t = ease((progress - s2) / (s3 - s2));
            currentHelloX = 50 * t;
            currentHelloOpacity = 1 - t;
            currentHelloTransform = `translate(${currentHelloX}vw, -50%) translateX(-50%)`;

            currentLaptopX = 10 + (50 - 25) * t;
            currentLaptopOpacity = 1;
            currentLaptopScale = 1;
            currentLaptopRotateY = 180 - 180 * t;
            currentLaptopTransform = `translate(${currentLaptopX}vw, -50%) scale(1)`;

            if (helloWorld) {
                helloWorld.style.opacity = currentHelloOpacity;
                helloWorld.style.transform = currentHelloTransform;
            }
            if (laptopContainer) {
                laptopContainer.style.opacity = currentLaptopOpacity;
                laptopContainer.style.transform = currentLaptopTransform;
            }
            // Camera orbit/other features remain commented as before
        }

        // ===============================
        // TRANSITION 3 → 4 (zoom/fade laptop)
        // ===============================
        else if (progress < s4) {
            if (navbar) navbar.style.opacity = '0';
            if (mainContent) mainContent.style.opacity = '0';
            
            const t = clamp((progress - s3) / (s4 - s3));
            currentLaptopX = 50;
            let laptopAlpha = 1;
            if (t > 0.9) {
                laptopAlpha = 1 - (t - 0.9) / 0.1;
                if (laptopAlpha < 0) laptopAlpha = 0;
            }
            currentLaptopOpacity = laptopAlpha;
            currentLaptopScale = 1 + 10 * t;
            const currentLaptopPerspective = 'perspective(2000px) ';
            currentLaptopTransform = `${currentLaptopPerspective}translate(${currentLaptopX}vw, -20%) translateX(-50%) scale(${currentLaptopScale})`;

            if (helloWorld) helloWorld.style.opacity = 0;
            if (laptopContainer) {
                laptopContainer.style.opacity = currentLaptopOpacity;
                laptopContainer.style.transform = currentLaptopTransform;
            }
        }
        else {
            if (navbar) navbar.style.opacity = '1';
            if (mainContent) mainContent.style.opacity = '1';
        
            if (laptopContainer) {
                laptopContainer.style.opacity = 0;
            }
        }
        

        // Expose state for debugging/inspection
        window.__cinematicScrollState = {
            progress: progress,
            hello: {
                x: currentHelloX,
                opacity: currentHelloOpacity,
                transform: helloWorld ? helloWorld.style.transform : ''
            },
            laptop: {
                x: currentLaptopX,
                opacity: currentLaptopOpacity,
                scale: currentLaptopScale,
                rotateY: typeof currentLaptopRotateY !== 'undefined' ? currentLaptopRotateY : 0,
                transform: laptopContainer ? laptopContainer.style.transform : ''
            }
        };
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScene();
                ticking = false;
            });
            ticking = true;
        }
    });
    window.addEventListener('resize', () => {
        totalHeight = scrollContainer.offsetHeight - window.innerHeight;
        updateScene();
    });
    updateScene();
})();