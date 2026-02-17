(function () {

    const track = document.querySelector('.skills-track');
    if (!track) return;

    let position = 0;
    let speed = 0.5; // מהירות תנועה
    let isDragging = false;
    let startX = 0;
    let startPosition = 0;

    // שכפול אוטומטי של התוכן פעם אחת (לא צריך HTML כפול)
    track.innerHTML += track.innerHTML;

    function animate() {
        if (!isDragging) {
            position -= speed;

            // Reset חלק לחלוטין בלי קפיצה
            if (Math.abs(position) >= track.scrollWidth / 2) {
                position = 0;
            }

            track.style.transform = `translateX(${position}px)`;
        }

        requestAnimationFrame(animate);
    }

    animate();

    // ---- DRAG SUPPORT ----

    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        startPosition = position;
        track.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        track.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta = e.pageX - startX;
        position = startPosition + delta;
        track.style.transform = `translateX(${position}px)`;
    });

})();
