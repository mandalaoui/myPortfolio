import "./ProjectCard.css";
import Tag from "../../components/Tag";
import { FaExternalLinkAlt, FaGithub, FaPlayCircle } from "react-icons/fa";

export default function ProjectCard({ project, onWatchDemo }) {
  return (
    <div className="project-card">
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

      <img src={project.image} alt={project.title} className="project-image" />

      <div className="project-links">
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
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
          <button className="project-link" onClick={() => onWatchDemo(project.video)}>
            <FaPlayCircle /> Watch Demo
          </button>
        )}
      </div>
    </div>
  );
}
