import React, { useState, useEffect } from 'react';
import Hero3D from './sections/heroSection/Hero3D';
import Projects from './sections/projectSection/Projects';
import About from './sections/aboutSection/about';
import './styles/App.css'; // Assuming you have a global CSS file for styles
import useFadeAndLineObserver from './hooks/useFadeAndLineObserver';
import NatureBackground from './components/NatureBackground';
import Resume from './sections/resumeSection/resume';
import Skills from './sections/skillsSection/skills';
import Contact from './sections/contactSection/contact';


function App() {
  const [currentSection, setCurrentSection] = useState(0); // 0=Hero, 1=Projects, 2=About
  const [scrollLocked, setScrollLocked] = useState(true);

  useEffect(() => {
    if (scrollLocked) return; // ❌ אל תאזין אם הגלילה חסומה

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY < 600) setCurrentSection(0); // Hero
      else if (scrollY < 1800) setCurrentSection(1); // About
      else if (scrollY < 2400) setCurrentSection(2); // Projects
      else if (scrollY < 3000) setCurrentSection(3); // Skills
      else if (scrollY < 3600) setCurrentSection(4); // Resume
      else setCurrentSection(5); // Contact
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollLocked]);

  useEffect(() => {
    if (scrollLocked) {
      document.body.style.overflowY  = 'hidden';
    } else {
      document.body.style.overflowY  = 'auto';
    }
  }, [scrollLocked]);

  useEffect(() => {
    if (scrollLocked) return;

    let scrollTarget = window.scrollY;
    let currentScroll = window.scrollY;
    let ticking = false;

    const smoothStep = () => {
      const delta = (scrollTarget - currentScroll) * 0.05; // תנועה רכה
      currentScroll += delta;

      window.scrollTo(0, currentScroll);

      if (Math.abs(scrollTarget - currentScroll) > 0.5) {
        requestAnimationFrame(smoothStep);
      } else {
        ticking = false;
      }
    };

    const onWheel = (e) => {
      e.preventDefault();

      scrollTarget += e.deltaY;

      // Clamp ל־0 למעלה, וגובה המסמך למטה
      scrollTarget = Math.max(0, Math.min(scrollTarget, document.body.scrollHeight - window.innerHeight));

      if (!ticking) {
        requestAnimationFrame(smoothStep);
        ticking = true;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });

    return () => window.removeEventListener('wheel', onWheel);
  }, [scrollLocked]);


  useFadeAndLineObserver();

  return (
    <>
      <div className="background-canvas">
        <NatureBackground currentSection={currentSection} />
      </div>
      <Hero3D onIntroFinish={() => setScrollLocked(false)} />
      <About />
      <Projects />
      <Resume />
      <Skills />
      <Contact />
    </>
  );
}


export default App;
