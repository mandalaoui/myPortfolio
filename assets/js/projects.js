// Projects section horizontal scroll behavior.

(function () {
    const projectsSection = document.querySelector('.projects-section');
    const projectsContainer = document.getElementById('projectsContainer');

    if (!projectsSection || !projectsContainer) {
        return;
    }

    window.addEventListener('scroll', () => {
        const rect = projectsSection.getBoundingClientRect();
        const scrollProgress = -rect.top / (rect.height - window.innerHeight);

        if (scrollProgress >= 0 && scrollProgress <= 1) {
            const maxScroll = projectsContainer.scrollWidth - window.innerWidth;
            projectsContainer.style.transform = `translateX(-${scrollProgress * maxScroll}px)`;
        }
    });
})();
