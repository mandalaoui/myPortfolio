import './resume.css';

const Resume = () => {
  return (
    <section id="resume" className="resume-section">
      <h2 className="section-title reveal-line" style={{ '--delay': '0.4s' }}>My Resume</h2>
      <span className="arrow-down reveal-line" style={{ '--delay': '0.5s' }}>⬇️</span>
      <a
        href="/files/Resume_OmerMandalaoui.pdf"
        className="btn btn-animate reveal-line"
        style={{ '--delay': '0.6s' }}
        download
      >
        📄 Download Resume
      </a>
    </section>
  );
};

export default Resume;
