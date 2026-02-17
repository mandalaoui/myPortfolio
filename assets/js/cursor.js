// Enhanced custom cursor and follower effect, matching hero-with-photo.html implementation.

(function () {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = (mx - 6) + 'px';
        cursor.style.top = (my - 6) + 'px';
    });

    function animateFollower() {
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        follower.style.left = (fx - 18) + 'px';
        follower.style.top = (fy - 18) + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor hover scale effect for interactive elements
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            follower.style.borderColor = 'rgba(0,245,255,1)';
        });
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.borderColor = 'rgba(0,245,255,0.5)';
        });
    });
})();
