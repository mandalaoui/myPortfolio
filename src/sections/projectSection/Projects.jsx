import { useRef, useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import projects from "../../data/projects";
import "./Projects.css";

export default function Projects() {
  const [selected, setSelected] = useState(null);
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
    const minScrollThreshold = 30; // רק אם יש יותר מ־50px גלילה, נציג חץ

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
      <h2 className="projects-title">{title}</h2>
      <div className="projects-carousel-wrapper">
        {showArrows[key].left && (
          <button className="carousel-arrow left" onClick={() => scroll(ref, -1, key)}>
            ←
          </button>
        )}
        <div
          className="projects-carousel"
          ref={ref}
          onScroll={() => checkScroll(ref, key)}
        >
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={setSelected} />
          ))}
        </div>
        {showArrows[key].right && (
          <button className="carousel-arrow right" onClick={() => scroll(ref, 1, key)}>
            →
          </button>
        )}
      </div>
    </>
  );

  return (
    <section className="projects-section">
      {renderSection("University Projects", projects.university, universityRef, "university")}
      {renderSection("Independent Projects", projects.independent, independentRef, "independent")}
      <ProjectModal project={selected} open={!!selected} onClose={() => setSelected(null)} />
    </section>
  );
}
