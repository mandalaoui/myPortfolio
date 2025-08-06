import React from 'react';
import './resume.css';

const Resume = () => {
  return (
    <section id="resume" className="resume-section">
      <h2 className="section-title reveal-line" style={{ '--delay': '0.5s' }}>My Resume</h2>
      <a
        href="/files/Resume_OmerMandalaoui.pdf"
        className="btn btn-animate reveal-line"
        style={{ '--delay': '1s' }}
        download
      >
        📄 Download Resume
      </a>
    </section>
  );
};

export default Resume;
