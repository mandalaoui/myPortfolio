// Project card templates (data: projectsData.js).
//   createProjectCard(project, index) -> large featured card (sideways track)
//   badges / links / wireVideo are shared with moreProjects.js

const TYPE_ICON = {
  client: "fa-briefcase",
  academic: "fa-graduation-cap",
  independent: "fa-rocket"
};

const TYPE_LABEL = {
  client: "Client Project",
  academic: "Academic Project",
  independent: "Independent Project"
};

export function badges(project) {
  const type = `
    <span class="project-type ${project.type}">
      <i class="fas ${TYPE_ICON[project.type] || "fa-folder"}"></i>
      <span>${TYPE_LABEL[project.type] || project.type}</span>
    </span>`;
  const ai = project.ai
    ? `<span class="project-ai-badge"><i class="fas fa-wand-magic-sparkles"></i><span>AI</span></span>`
    : "";
  return `<div class="project-badges">${type}${ai}</div>`;
}

function image(project) {
  // Clicking the image also opens the video, when there is one.
  const fallback = TYPE_ICON[project.type] || "fa-image";
  return `
    <div class="project-image">
      <img src="${project.image}" alt="${project.title}" loading="lazy"
        ${project.video ? `data-video="${project.video}" style="cursor:pointer"` : ""}
        data-fallback="${fallback}">
    </div>`;
}

function tags(project, max) {
  return `
    <div class="project-tags">
      ${project.tags.slice(0, max).map(tag => `<span class="tag">${tag}</span>`).join("")}
    </div>`;
}

export function links(project) {
  const items = [];
  if (project.live) {
    items.push(`<a href="${project.live}" target="_blank" rel="noopener" class="project-link"><i class="fas fa-external-link-alt"></i> Live</a>`);
  }
  if (project.github) {
    items.push(`<a href="${project.github}" target="_blank" rel="noopener" class="project-link"><i class="fab fa-github"></i> Code</a>`);
  }
  if (project.video) {
    items.push(`<button type="button" class="project-link" data-video="${project.video}"><i class="fas fa-play"></i> Video</button>`);
  }
  return `<div class="project-links">${items.join("")}</div>`;
}

// Missing screenshot -> type icon (a listener instead of an inline onerror,
// so the Content-Security-Policy can forbid inline scripts).
export function wireImageFallback(root) {
  root.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      const icon = document.createElement("i");
      icon.className = `fas ${img.dataset.fallback}`;
      img.replaceWith(icon);
    }, { once: true });
  });
}

export function wireVideo(card) {
  card.querySelectorAll("[data-video]").forEach(el => {
    el.addEventListener("click", () => {
      if (typeof window.openVideoModal === "function") window.openVideoModal(el.dataset.video);
    });
  });
}

export function createProjectCard(project, index) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <div class="project-number">${String(index).padStart(2, "0")}</div>
    <div class="project-content">
      <div>
        ${image(project)}
        ${badges(project)}
        <h3 class="project-title">${project.title}</h3>
        <p class="project-summary">${project.summary}</p>
        ${project.highlights && project.highlights.length ? `
          <p class="project-highlights-label">Highlights</p>
          <ul class="project-highlights">
            ${project.highlights.map(h => `<li>${h}</li>`).join("")}
          </ul>` : ""}
        ${tags(project, 5)}
      </div>
      ${links(project)}
    </div>
  `.trim();
  wireVideo(card);
  wireImageFallback(card);
  return card;
}
