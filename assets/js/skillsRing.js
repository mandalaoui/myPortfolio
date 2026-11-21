// Technical Stack: a 3D ring of technology cards.
//
// Cards sit on a cylinder (rotateY + translateZ) that turns slowly on its own
// and can be dragged. Cards toward the back fade and turn grey; the card at
// the front is in full color. Without JS the cards wrap as a plain grid.
// prefers-reduced-motion: no auto-rotation (dragging still works).
// Pauses while the section is off screen.

(function () {
    const stage = document.getElementById('skillsStage');
    const ring = document.getElementById('skillsRing');
    if (!stage || !ring) return;

    const cards = Array.from(ring.children);
    const n = cards.length;
    if (!n) return;

    const step = 360 / n;
    const SPEED = 7;         // degrees per second (auto-rotation; was 10, slowed on request)
    const DRAG = 0.3;        // degrees per pixel dragged
    const TILT = -6;         // look slightly down onto the ring
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let radius = 0;
    let rotation = 0;
    let direction = -1;      // keeps turning the way it was last dragged
    let dragging = false;
    let lastX = 0;
    let visible = true;
    let lastTime = 0;

    stage.classList.add('is-3d');

    // Radius from card width so neighbouring cards don't overlap.
    function layout() {
        const width = cards[0].offsetWidth;
        const gap = width * 0.18;
        radius = (n * (width + gap)) / (2 * Math.PI);
        ring.style.transform = `translateZ(${-radius}px) rotateX(${TILT}deg)`;
        render();
    }

    function render() {
        cards.forEach((card, i) => {
            const angle = i * step + rotation;
            const depth = Math.cos((angle * Math.PI) / 180);   // 1 front, -1 back
            const near = Math.max(0, (depth + 0.3) / 1.3);
            const color = Math.max(0, (depth - 0.55) / 0.45);  // only the front gets color
            card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            card.style.opacity = (0.3 + 0.7 * near).toFixed(3);
            card.style.filter = `grayscale(${(1 - color).toFixed(3)})`;
            card.style.zIndex = String(Math.round((depth + 1) * 100));
        });
    }

    function tick(time) {
        const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
        lastTime = time;
        if (visible && !dragging && !reducedMotion.matches) {
            rotation += direction * SPEED * dt;
            render();
        }
        requestAnimationFrame(tick);
    }

    // Dragging (mouse and touch). touch-action: pan-y in CSS keeps vertical
    // page scrolling native; a vertical swipe cancels the drag.
    stage.addEventListener('pointerdown', (e) => {
        dragging = true;
        lastX = e.clientX;
        stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        if (dx !== 0) {
            rotation += dx * DRAG;
            direction = dx < 0 ? -1 : 1;
            render();
        }
    });
    const endDrag = () => { dragging = false; };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            visible = entries[0].isIntersecting;
        }).observe(stage);
    }

    window.addEventListener('resize', layout);
    layout();
    requestAnimationFrame(tick);
})();
