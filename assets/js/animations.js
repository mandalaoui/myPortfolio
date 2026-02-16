// Fade-in and fade-out on scroll: elements smoothly appear when in view, disappear when out.

(function () {
  const FADE_SELECTORS = [
    '.timeline-item',
    '.contact-item',
    '.project-card',
    '.skill-card',
    '.about-text',
    '.hero-content'
  ].join(',');

  const fadeElements = document.querySelectorAll(FADE_SELECTORS);

  if (!fadeElements.length) return;

  // Ensure initial state for fade-in/out
  fadeElements.forEach((el) => {
    el.style.opacity = (el.style.opacity && el.style.opacity !== "1") ? el.style.opacity : "0";
    el.style.transform = (el.style.transform && el.style.transform !== "none") ? el.style.transform : "translateY(40px)";
    el.style.transition = "opacity 0.6s cubic-bezier(.42,0,.58,1), transform 0.6s cubic-bezier(.42,0,.58,1)";
    el.style.pointerEvents = "none";
  });

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
          // Fade in
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.pointerEvents = "auto";
        } else {
          // Fade out
          el.style.opacity = "0";
          el.style.transform = "translateY(40px)";
          el.style.pointerEvents = "none";
        }
      });
    },
    {
      threshold: [0, 0.2, 1]
    }
  );

  fadeElements.forEach(el => fadeObserver.observe(el));
})();
