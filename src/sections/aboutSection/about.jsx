import React, { useRef, useEffect } from 'react';
import './about.css';

const About = () => {
  const sectionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('line-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sectionEl = sectionRef.current;
    const revealLines = sectionEl.querySelectorAll('.reveal-line');
    observer.observe(sectionEl);
    revealLines.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <h2 className="section-title reveal-line" style={{ '--delay': '0.3s' }}>Meet Omer</h2>

      <div className="about-wrapper">
        {/* Card 3D Profile */}
        <div className="card-3d profile-card reveal-line" style={{ '--delay': '0.3s' }}>
          <div className="card-inner">
            <div className="card-front">
              <img src="/images/profile.png" alt="Omer Mandalaoui" />
            </div>
            <div className="card-back">
              <h3>👋 Hey There!</h3>
              <p>I'm Omer, a fullstack dev with military-grade leadership.</p>
            </div>
          </div>
        </div>

        {/* Main Text Block */}
        <div className="about-text reveal-line"  style={{ '--delay': '0.3s' }}>
          <h3 className="highlight-glow">From Leading Teams to Building Systems</h3>
          <p>
            I'm Omer Mandalaoui, a passionate Computer Science student and Fullstack Developer. With a strong background in military service, I bring leadership, discipline, and strategic thinking into code.
          </p>
          <p>
            I thrive on building modern, user-centric web applications with thoughtful design. My journey blends technology, problem-solving, and people – from commanding military teams to leading tech projects.
          </p>

          <div className="glow-grid">
            <div className="info-card reveal-line glass-card" style={{ '--delay': '0.5s' }}>
              <h3>🎓 Education</h3>
              <p className="info-title">B.Sc. in Computer Science</p>
              <p>Bar Ilan University • 2023 - Present</p>
            </div>
            <div className="info-card reveal-line glass-card" style={{ '--delay': '0.5s' }}>
              <h3>💼 Experience</h3>
              <p className="info-title">HR Officer • IDF (2019 - 2022)</p>
              <p>Managed teams, processes, and built planning skills under pressure.</p>
            </div>
          </div>

          <div className="about-buttons reveal-line"  style={{ '--delay': '0.2s' }}>
            <a href="#projects" className="btn btn-glow">🚀 View Projects</a>
            <a href="#contact" className="btn btn-outline">📬 Contact Me</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
