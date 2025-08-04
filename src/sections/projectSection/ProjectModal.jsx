import Modal from "../../components/Modal";
import Tag from "../../components/Tag";
import "./ProjectModal.css";

export default function ProjectModal({ project, open, onClose }) {
  if (!project) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2>{project.title}</h2>
      <img src={project.image} alt={project.title} className="modal-image" />
      <p>{project.longDescription}</p>
      <div className="tags">{project.tags.map((t) => <Tag key={t} text={t} />)}</div>
      <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
        Visit Project
      </a>
    </Modal>
  );
}
