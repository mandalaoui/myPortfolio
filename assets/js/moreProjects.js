// "More projects" index (non-featured projects, data: projectsData.js).
//
// Desktop: a list of rows beside a large sticky preview. The active project is
// the hovered row, or — when the pointer isn't over the list — the row closest
// to the middle of the screen, so the preview also changes while scrolling.
// Mobile (<= 37.5rem): rows with thumbnails; tapping a row expands it in place
// (screenshot, full sentence, buttons). One row open at a time.

import { badges, links, wireVideo } from "./projectCard.js?v=p4";

const MOBILE = window.matchMedia("(max-width: 37.5rem)");

export function renderMoreProjects(list, preview, projects, firstNumber) {
  if (!list || !preview || !projects.length) return;

  // ── Rows ────────────────────────────────────────────────────
  const rows = projects.map((project, i) => {
    const li = document.createElement("li");
    li.className = "more-row";
    const num = String(firstNumber + i).padStart(2, "0");
    li.innerHTML = `
      <button type="button" class="more-row-head" aria-expanded="false">
        <span class="more-row-num">${num}</span>
        <span class="more-row-thumb"><img src="${project.image}" alt="" loading="lazy"
          onerror="this.style.visibility='hidden'"></span>
        <span class="more-row-text">
          <span class="more-row-title">${project.title}</span>
          <span class="more-row-short">${project.short || ""}</span>
        </span>
        ${badges({ ...project, ai: false })}
        <i class="fas fa-chevron-down more-row-chevron" aria-hidden="true"></i>
      </button>
      <div class="more-row-body">
        <div class="more-row-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
          ${project.video ? `<button type="button" class="more-play" data-video="${project.video}" aria-label="Play video"><i class="fas fa-play"></i></button>` : ""}
        </div>
        <p class="project-summary">${project.summary}</p>
        ${links(project)}
      </div>`;
    wireVideo(li.querySelector(".more-row-body"));
    list.appendChild(li);
    return li;
  });

  // ── Desktop preview ─────────────────────────────────────────
  const img = preview.querySelector(".more-preview-img");
  const title = preview.querySelector(".more-preview-title");
  const play = preview.querySelector(".more-play");
  const summary = preview.querySelector(".more-preview-summary");
  const actions = preview.querySelector(".more-preview-links");
  let active = -1;

  function setActive(i) {
    if (i === active || i < 0) return;
    active = i;
    const project = projects[i];
    rows.forEach((row, j) => row.classList.toggle("active", j === i));

    preview.classList.add("swapping");
    window.setTimeout(() => {
      img.src = project.image;
      img.alt = project.title;
      title.textContent = project.title;
      summary.textContent = project.summary;
      play.hidden = !project.video;
      play.dataset.video = project.video || "";
      actions.innerHTML = links(project);
      wireVideo(actions);
      preview.classList.remove("swapping");
    }, 160);
  }

  play.addEventListener("click", () => {
    if (play.dataset.video && typeof window.openVideoModal === "function") {
      window.openVideoModal(play.dataset.video);
    }
  });

  // Hover / focus picks the row.
  let pointerInside = false;
  list.addEventListener("pointerenter", () => { pointerInside = true; });
  list.addEventListener("pointerleave", () => { pointerInside = false; });
  rows.forEach((row, i) => {
    const head = row.querySelector(".more-row-head");
    row.addEventListener("pointerenter", () => { if (!MOBILE.matches) setActive(i); });
    head.addEventListener("focus", () => { if (!MOBILE.matches) setActive(i); });

    // Mobile: tap expands this row (and collapses the others).
    head.addEventListener("click", () => {
      if (!MOBILE.matches) { setActive(i); return; }
      const open = !row.classList.contains("open");
      rows.forEach(r => {
        r.classList.remove("open");
        r.querySelector(".more-row-head").setAttribute("aria-expanded", "false");
      });
      if (open) {
        row.classList.add("open");
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Scroll picks the row nearest the middle of the screen (desktop, no hover).
  let frame = 0;
  function onScroll() {
    frame = 0;
    if (MOBILE.matches || pointerInside) return;
    const box = list.getBoundingClientRect();
    if (box.bottom < 0 || box.top > window.innerHeight) return;
    const mid = window.innerHeight / 2;
    let best = 0;
    let bestDist = Infinity;
    rows.forEach((row, i) => {
      const r = row.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setActive(best);
  }
  window.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(onScroll);
  }, { passive: true });

  setActive(0);
}
