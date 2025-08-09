import './skills.css';

const skills = [
  { name: 'React', icon: 'fab fa-react' },
  { name: 'Node.js', icon: 'fab fa-node-js' },
  { name: 'Python', icon: 'fab fa-python' },
  { name: 'MongoDB', icon: 'fas fa-database' },
  { name: 'Git', icon: 'fab fa-git-alt' },
  { name: 'Docker', icon: 'fab fa-docker' },
  { name: 'JavaScript', icon: 'fab fa-js' },
  { name: 'CSS3', icon: 'fab fa-css3-alt' },
  { name: 'Java', icon: 'fab fa-java' },
  { name: 'C++', icon: null, img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg' },
  { name: 'OpenAI', icon: null, img: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg', blue: true },
  { name: 'VS Code', icon: null, img: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg' },
];

const Skills = () => {
  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        <h2 className="section-title reveal-line" style={{ '--delay': '0.2s' }}>My Skills</h2>
        <div className="skills-grid">
          {skills.map((skill, i) => (
            <div className="skill-card reveal-line" style={{ '--delay': '0.6s' }} key={skill.name}>
              <div className="skill-icon">
                {skill.icon ? (
                  <i className={skill.icon}></i>
                ) : (
                    <img
                    src={skill.img}
                    alt={skill.name}
                    className={`skill-img ${skill.name === 'OpenAI' ? 'openai' : ''}`}
                    />
                )}
              </div>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;