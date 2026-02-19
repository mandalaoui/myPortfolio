export function createProjectCard(project, index) {
  const card = document.createElement("div");
  card.className = "project-card";

  const iconMap = {
    client: "fa-briefcase",
    academic: "fa-graduation-cap",
    independent: "fa-rocket"
  };

  // Distinct onerror icon fallback by project.title
  const onErrorIconMap = {
    "TeacherAssistantAI": "fa-chalkboard-teacher",
    "Netfilm": "fa-film",
    "Mika Coffee": "fa-coffee",
    "TrueValueIL": "fa-building",
    "wanderwise": "fa-leaf",
    "AI משכנתאות": "fa-chart-line",
    "MyStocks": "fa-money-bill-wave",
    "Mathy": "fa-square-root-alt",
    "Brick-Breaker": "fa-gamepad"
  };

  // Video/Click Logic
  let imageAttributes = `src="${project.image}" alt="${project.title}"`;
  let onClick = "";
  if (project.video) {
    onClick = `onclick="openVideoModal('${project.video}')"`;
  }
  // Compose onerror
  const onErrorIcon = onErrorIconMap[project.title] || "fa-image";
  imageAttributes += ` ${onClick} onerror="this.onerror=null;this.parentElement.innerHTML='<i class=\\'fas ${onErrorIcon}\\'></i>'"`;

  // Add unique id or class to project-image for further targeting if needed
  let projectImageDivAttrs = '';
  let projectImageExtra = '';
  if (project.ribbon) {
    // Inline style for position and cursor will default to pointer on hover
    projectImageDivAttrs = ` style="position: relative;"`;
    projectImageExtra = `<span class="project-ribbon">LIVE DEMO</span>`;
  }

  card.innerHTML = `
    <div class="project-number">${String(index).padStart(2, "0")}</div>
    <div class="project-content">
      <div>
        <div class="project-image"${projectImageDivAttrs}>
          ${projectImageExtra}
          <img ${imageAttributes}>
        </div>
        <div class="project-header">
          <h3 class="project-title">${project.title}</h3>
          <div class="project-type ${project.type}">
            <i class="fas ${iconMap[project.type]}"></i>
            <span>${projectTypeText(project.type)}</span>
          </div>
        </div>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
      <div class="project-links">
        ${project.github ? `
          <a href="${project.github}" target="_blank" class="project-link">
            <i class="fab fa-github"></i> GitHub
          </a>
        ` : ""}
        ${project.live ? `
          <a href="${project.live}" target="_blank" class="project-link">
            <i class="fas fa-external-link-alt"></i> Visit Site
          </a>
        ` : ""}
      </div>
    </div>
  `.trim();

  // If this project's ribbon is true, add a hover effect to show pointer on image hover
  if (project.ribbon) {
    // Find the image element inside this card (it will be present right after .project-image div)
    const projectImageDiv = card.querySelector('.project-image');
    const imageEl = projectImageDiv ? projectImageDiv.querySelector('img') : null;
    if (imageEl) {
      // Set style so that the cursor is pointer on hover
      imageEl.style.cursor = "pointer";
      // Optionally: Add :hover effect too for smooth experience
      imageEl.addEventListener('mouseenter', function () {
        imageEl.style.cursor = "pointer";
      });
      imageEl.addEventListener('mouseleave', function () {
        imageEl.style.cursor = "";
      });
    }
  }

  return card;
}

// Returns e.g. "Academic Project"
function projectTypeText(type) {
  switch (type) {
    case "academic": return "<span>Academic Project</span>";
    case "client": return "<span>Client Project</span>";
    case "independent": return "<span>Independent Project</span>";
    default: return `<span>${capitalize(type)} Project</span>`;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
