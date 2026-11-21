// Projects section horizontal scroll behavior.
// Vertical scroll progress through the section moves the cards sideways:
// right-to-left in English (cards start on the left), left-to-right in Hebrew
// (RTL: cards start on the right).

(function () {
    const projectsSection = document.querySelector('.projects-section');
    const projectsContainer = document.getElementById('projectsContainer');

    if (!projectsSection || !projectsContainer) {
        return;
    }

    function update() {
        const rect = projectsSection.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        const maxScroll = projectsContainer.scrollWidth - window.innerWidth;

        // Mobile layout stacks the cards vertically: no sideways scroll.
        if (travel <= 0 || maxScroll <= 0) {
            projectsContainer.style.transform = '';
            return;
        }

        const raw = -rect.top / travel;

        // Clamp rather than skip out-of-range values, so jumping past the
        // section (nav links, deep links) never leaves the cards mid-way.
        const scrollProgress = Math.min(1, Math.max(0, raw));

        // LTR reveals more cards by moving left (negative X); RTL by moving right.
        const direction = document.documentElement.dir === 'rtl' ? 1 : -1;
        projectsContainer.style.transform = `translateX(${direction * scrollProgress * maxScroll}px)`;
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('langchange', update);
})();
