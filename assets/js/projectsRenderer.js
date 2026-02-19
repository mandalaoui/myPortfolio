import { projectsData } from "./projectsData.js";
import { createProjectCard } from "./projectCard.js";

const container = document.getElementById("projectsContainer");

projectsData.forEach((project, index) => {
  const card = createProjectCard(project, index + 1);
  container.appendChild(card);
});
