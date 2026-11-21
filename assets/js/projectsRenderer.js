import { projectsData } from "./projectsData.js?v=p4";
import { createProjectCard } from "./projectCard.js?v=p4";
import { renderMoreProjects } from "./moreProjects.js?v=p4";

// Featured projects -> large cards in the sideways track (#projectsContainer).
// The rest -> the "More projects" index (list + preview, moreProjects.js).
const container = document.getElementById("projectsContainer");

const featured = projectsData.filter(p => p.featured);
const more = projectsData.filter(p => !p.featured);

featured.forEach((project, index) => {
  container.appendChild(createProjectCard(project, index + 1));
});

renderMoreProjects(
  document.getElementById("moreProjectsList"),
  document.getElementById("moreProjectsPreview"),
  more,
  featured.length + 1
);

// Position dots for the mobile swipe row (hidden on desktop via CSS).
// Indicator only: the active dot is the card closest to the row's center.
const dots = document.createElement("div");
dots.className = "projects-dots";
dots.setAttribute("aria-hidden", "true");
const cards = Array.from(container.children);
cards.forEach(() => dots.appendChild(document.createElement("span")));
container.after(dots);

let dotsFrame = 0;
function updateDots() {
  dotsFrame = 0;
  const box = container.getBoundingClientRect();
  const center = box.left + box.width / 2;
  let active = 0;
  let best = Infinity;
  cards.forEach((card, i) => {
    const r = card.getBoundingClientRect();
    const d = Math.abs(r.left + r.width / 2 - center);
    if (d < best) { best = d; active = i; }
  });
  Array.from(dots.children).forEach((dot, i) => dot.classList.toggle("active", i === active));
}
container.addEventListener("scroll", () => {
  if (!dotsFrame) dotsFrame = requestAnimationFrame(updateDots);
}, { passive: true });
document.addEventListener("langchange", updateDots);
updateDots();

// Cards render after the zoom transitions were measured; re-measure.
if (window.ZoomTransition) window.ZoomTransition.refresh();
