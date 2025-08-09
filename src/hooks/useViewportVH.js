import { useEffect } from 'react';

export default function useViewportVH() {
  useEffect(() => {
    const setVH = () => {
      // נבחר את הגובה המירבי מבין כל המקורות האפשריים
      const vv = window.visualViewport?.height || 0;
      const ih = window.innerHeight || 0;
      const sh = window.screen?.height || 0;
      const best = Math.max(vv, ih, sh);

      // נשמור כ- px ל- CSS var
      document.documentElement.style.setProperty('--app-vh', `${best}px`);
    };

    setVH();
    // מאזינים לשינויים דינמיים של ה-viewport במובייל
    window.addEventListener('resize', setVH);
    window.visualViewport?.addEventListener('resize', setVH);
    window.visualViewport?.addEventListener('scroll', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.visualViewport?.removeEventListener('resize', setVH);
      window.visualViewport?.removeEventListener('scroll', setVH);
    };
  }, []);
}
