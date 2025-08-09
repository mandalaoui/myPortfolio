import "./ProjectCard.css";
import Tag from "../../components/Tag";
import { FaExternalLinkAlt, FaGithub, FaPlayCircle } from "react-icons/fa";
import { useState, useRef } from "react";
import { Tilt } from "react-tilt";

export default function ProjectCard({ project, onWatchDemo }) {
  const tiltOptions = {
    max: 5,
    speed: 500,
    glare: true,
    "max-glare": 0.2,
    scale: 1,
  };

  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .catch((e) => {
          // מדיניות דפדפן מונעת autoplay או קריאה כפולה
          console.warn("Autoplay failed or was interrupted:", e.message);
        });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Tilt
      className="tilt-wrapper"
      options={tiltOptions}
      key={JSON.stringify(tiltOptions)} 
    >
      <div
        className="project-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="project-icon">
          <i className={project.icon}></i>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="tags">
          {project.tags.map((t) => (
            <Tag key={t} text={t} />
          ))}
        </div>

        <div className="project-preview">
          {project.video && hovered ? (
            <video
              ref={videoRef}
              src={project.video}
              muted
              loop
              playsInline
              className="project-media"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="project-media"
            />
          )}
        </div>

        <div className="project-links">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              {project.linkLabel?.toLowerCase().includes("github") ? (
                <>
                  <FaGithub /> GitHub
                </>
              ) : (
                <>
                  <FaExternalLinkAlt /> {project.linkLabel || "Website"}
                </>
              )}
            </a>
          )}

          {project.video && (
            <button
              className="project-link"
              onClick={() => onWatchDemo(project.video)}
            >
              <FaPlayCircle /> Watch Demo
            </button>
          )}
        </div>
      </div>
    </Tilt>
  );
}