import "./ProjectCard.css";
import Tag from "../../components/Tag";
import Button from "../../components/Button";

export default function ProjectCard({ project, onOpen }) {
  return (
    <div className="project-card">
      <div className="project-icon">
        <i className={project.icon}></i>
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tags">{project.tags.map((t) => <Tag key={t} text={t} />)}</div>
      <img src={project.image} alt={project.title} className="project-image" />
      <Button text="View More" onClick={() => onOpen(project)} />
    </div>
  );
}
