import React, { useState, useEffect, useRef } from 'react';
import Hero3D from './sections/heroSection/Hero3D';
import Projects from './sections/projectSection/Projects';
import About from './sections/aboutSection/about';
import useFadeAndLineObserver from './hooks/useFadeAndLineObserver';
import NatureBackground from './components/NatureBackground';
import Resume from './sections/resumeSection/resume';
import Skills from './sections/skillsSection/skills';
import Contact from './sections/contactSection/contact';
import useViewportVH from './hooks/useViewportVH';
import './styles/App.css'; // Assuming you have a global CSS file for styles


function App() {
  const [currentSection, setCurrentSection] = useState(0); // 0=Hero, 1=Projects, 2=About
  const [scrollLocked, setScrollLocked] = useState(true);

    // 🔽 refs לכל section
  const heroRef = useRef();
  const aboutRef = useRef();
  const projectsRef = useRef();
  const skillsRef = useRef();
  const resumeRef = useRef();
  const contactRef = useRef();

  useViewportVH();
  
  useEffect(() => {
    if (scrollLocked) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const buffer = window.innerHeight / 2; // מרווח כדי לזהות "אמצע מסך"

      const sectionOffsets = [
        heroRef.current?.offsetTop || 0,
        aboutRef.current?.offsetTop || 0,
        projectsRef.current?.offsetTop || 0,
        skillsRef.current?.offsetTop || 0,
        resumeRef.current?.offsetTop || 0,
        contactRef.current?.offsetTop || 0
      ];

      let active = 0;
      for (let i = 0; i < sectionOffsets.length; i++) {
        const start = sectionOffsets[i];
        const end = sectionOffsets[i + 1] || Infinity;

        if (scrollY + buffer >= start && scrollY + buffer < end) {
          active = i;
          break;
        }
      }

      setCurrentSection(active);
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
      <Hero3D ref={heroRef} onIntroFinish={() => setScrollLocked(false)} />
      <div ref={aboutRef}><About /></div>
      <div ref={projectsRef}><Projects /></div>
      <div ref={skillsRef}><Skills /></div>
      <div ref={resumeRef}><Resume /></div>
      <div ref={contactRef}><Contact /></div>
    </>
  );
}


export default App;
