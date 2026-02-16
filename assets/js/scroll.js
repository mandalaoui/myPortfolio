// Global scroll-related behaviors (progress indicator, infinite scroll to top).

(function () {
    // Scroll progress indicator
    const scrollProgressElement = document.getElementById('scrollProgress');

    if (scrollProgressElement) {
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) {
                scrollProgressElement.style.width = '0';
                return;
            }

            const scrolled = (window.scrollY / scrollHeight) * 100;
            scrollProgressElement.style.width = scrolled + '%';
        });
    }

    // Infinite scroll - Return to top when reaching the bottom
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (isScrolling) {
            return;
        }

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY + window.innerHeight;

        // If reached bottom, smoothly scroll to top
        // if (scrollPosition >= scrollHeight - 100) {
        //     isScrolling = true;
        //     setTimeout(() => {
        //         window.scrollTo({
        //             top: 0,
        //             behavior: 'smooth'
        //         });
        //         setTimeout(() => {
        //             isScrolling = false;
        //         }, 1000);
        //     }, 300);
        // }
    });
})();
