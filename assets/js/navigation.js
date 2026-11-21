// Navigation-related behaviors (e.g. smooth scrolling).

(function () {
    // Smooth scroll for in-page navigation links
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            const targetSelector = this.getAttribute('href');
            if (!targetSelector || targetSelector === '#') {
                return;
            }

            const target = document.querySelector(targetSelector);
            if (!target) {
                return;
            }

            event.preventDefault();

            // Sections inside a zoom transition's pinned range need a computed
            // landing position (see zoomTransition.js).
            const zoomY = window.ZoomTransition && window.ZoomTransition.scrollTargetFor(target);
            if (typeof zoomY === 'number') {
                window.scrollTo({ top: zoomY, behavior: 'smooth' });
                return;
            }

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
})();
