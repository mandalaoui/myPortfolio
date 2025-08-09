import { useEffect } from 'react';

export default function useFadeAndLineObserver() {
  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add('visible');
          } else {
            el.classList.remove('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const lineObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const el = entry.target;

          if (entry.isIntersecting) {
            el.classList.add('line-visible');

            // 💡 Reset animation trick:
            const line = el.querySelector('.line-anim');
            if (line) {
                line.style.animation = 'none';
                void line.offsetHeight; // ✅ ESLint won't complain
                line.style.animation = 'lineReveal 1s ease forwards';
            }
          } else {
            el.classList.remove('line-visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    // document.querySelectorAll('.section-fade').forEach(el => fadeObserver.observe(el));
    document.querySelectorAll('.reveal-line').forEach(el => lineObserver.observe(el));

    return () => {
      fadeObserver.disconnect();
      lineObserver.disconnect();
    };
  }, []);
}
