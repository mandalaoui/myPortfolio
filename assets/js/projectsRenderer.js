import { projectsData } from "./projectsData.js";
import { createProjectCard } from "./projectCard.js";

const container = document.getElementById("projectsContainer");

projectsData.forEach((project, index) => {
  const card = createProjectCard(project, index + 1);
  container.appendChild(card);
});

// Cards render after the zoom transitions were measured; re-measure.
if (window.ZoomTransition) window.ZoomTransition.refresh();
