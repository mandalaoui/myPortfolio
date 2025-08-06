import { useRef, useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import Modal from "../../components/Modal";
import projects from "../../data/projects";
import useFadeAndLineObserver from "../../hooks/useFadeAndLineObserver";
import "./Projects.css";

export default function Projects() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const universityRef = useRef(null);
  const independentRef = useRef(null);

  const [showArrows, setShowArrows] = useState({
    university: { left: false, right: false },
    independent: { left: false, right: false }
  });

  const checkScroll = (ref, key) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    const remainingRight = scrollWidth - (scrollLeft + clientWidth);
    const minScrollThreshold = 30;
    setShowArrows(prev => ({
      ...prev,
      [key]: {
        left: scrollLeft > minScrollThreshold,
        right: remainingRight > minScrollThreshold
      }
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      checkScroll(universityRef, "university");
      checkScroll(independentRef, "independent");
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scroll = (ref, dir, key) => {
    if (!ref.current) return;
    const amount = ref.current.offsetWidth * 0.8;
    ref.current.scrollBy({ left: dir * amount, behavior: "smooth" });
    setTimeout(() => checkScroll(ref, key), 300);
  };

  const renderSection = (title, list, ref, key) => (
    <>
      <h2 className="projects-title reveal-line" style={{ '--delay': '0s' }}>{title}</h2>
      <div className="projects-carousel-wrapper reveal-line" style={{ '--delay': '0.6s' }}>
        {showArrows[key].left && (
          <button className="carousel-arrow left" onClick={() => scroll(ref, -1, key)}>←</button>
        )}
        <div className="projects-carousel" ref={ref} onScroll={() => checkScroll(ref, key)}>
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} onWatchDemo={() => setSelectedVideo(p.video)} />
          ))}
        </div>
        {showArrows[key].right && (
          <button className="carousel-arrow right" onClick={() => scroll(ref, 1, key)}>→</button>
        )}
      </div>
    </>
  );

  useFadeAndLineObserver();

  return (
    <section id="projects" className="reveal-line" style={{ '--delay': '0.1s' }}>
      <section className="projects-section">
        {renderSection("University Projects", projects.university, universityRef, "university")}
        {renderSection("Independent Projects", projects.independent, independentRef, "independent")}
        {selectedVideo && (
          <Modal open={!!selectedVideo} onClose={() => setSelectedVideo(null)}>
            <video src={selectedVideo} controls autoPlay muted style={{ width: "100%", borderRadius: "10px" }} />
          </Modal>
        )}
      </section>
    </section>
  );
}
