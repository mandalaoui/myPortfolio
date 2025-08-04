import "./Button.css";

export default function Button({ text, onClick }) {
  return (
    <button className="project-button" onClick={onClick}>
      {text}
    </button>
  );
}
