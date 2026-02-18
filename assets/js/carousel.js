(function () {

    const track = document.querySelector('.skills-track');
    if (!track) return;

    let position = 0;
    let speed = 0.5;
    let isDragging = false;
    let startX = 0;
    let startPosition = 0;
    let animationFrameId = null;
    let isMobile = window.matchMedia('(pointer: coarse)').matches;

    // Duplicate the track for looping
    track.innerHTML += track.innerHTML;

    function updateTrackTransform(x) {
        track.style.transform = `translateX(${x}px)`;
    }

    function animate() {
        if (!isDragging) {
            position -= speed;
            if (Math.abs(position) >= track.scrollWidth / 2) {
                position = 0;
            }
            updateTrackTransform(position);
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    // Always start animation for both desktop and mobile for consistency
    animate();

    // Drag logic (works for both mouse and touch)
    function dragStart(pageX) {
        isDragging = true;
        startX = pageX;
        startPosition = position;
        // Add visual feedback for both desktop and mobile
        track.style.cursor = 'grabbing';
        track.classList.add('dragging');
    }

    function dragMove(pageX) {
        if (!isDragging) return;
        const delta = pageX - startX;
        position = startPosition + delta;
        updateTrackTransform(position);
    }

    function dragEnd() {
        isDragging = false;
        // Remove visual feedback
        track.style.cursor = (isMobile ? 'grab' : 'grab');
        track.classList.remove('dragging');
    }

    // Mouse events (desktop)
    track.addEventListener('mousedown', (e) => {
        dragStart(e.pageX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragMove(e.pageX);
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        dragEnd();
    });

    // Touch events (mobile/tablet)
    track.addEventListener('touchstart', (e) => {
        if (!e.touches[0]) return;
        dragStart(e.touches[0].pageX);
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging || !e.touches[0]) return;
        dragMove(e.touches[0].pageX);
        // Prevent default to avoid vertical scroll while dragging horizontally
        e.preventDefault();
    }, { passive: false });

    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        dragEnd();
    });

    // Set grab cursor for both desktop and mobile, for better UX
    track.style.cursor = 'grab';

    // Handle orientation/device changes
    window.addEventListener('resize', () => {
        isMobile = window.matchMedia('(pointer: coarse)').matches;
    });

})();
