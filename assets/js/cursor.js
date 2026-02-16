// Custom cursor and hover effects.

(function () {
    const cursor = document.querySelector('.cursor');

    if (!cursor) {
        return;
    }

    document.addEventListener('mousemove', (event) => {
        const { clientX, clientY } = event;
        cursor.style.left = clientX + 'px';
        cursor.style.top = clientY + 'px';
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
})();
