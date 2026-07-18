/* ============================================
   Folder Content — Projects
   Windows Explorer-style: list on the left,
   details pane on the right.
   ============================================ */

window.FolderContent = window.FolderContent || {};
window.FolderInit = window.FolderInit || {};

const PROJECTS_DATA = [
  {
    id: "lumin",
    name: "LUMIN",
    subtitle: "Smart Home Energy Management System",
    date: "Aug 2025 – Jan 2026",
    badge: "🎓 Graduation Project",
    image:
      "https://res.cloudinary.com/maz4meys/image/upload/v1784400297/Untitled_design_6_vpbpen.png",
    description:
      "LUMIN is an AI & IoT-powered app that helps households track their electricity usage, cut costs, and make smarter energy decisions. It gives real-time consumption monitoring, predicts upcoming bills with customizable budget alerts, offers AI-driven tips tailored to each user's habits, and forecasts solar energy production up to 2 years ahead (97% accuracy using XGBoost) with investment guidance based on expected returns.",
    tags: [
      "Google Colab",
      "Flutter",
      "Supabase",
      "Firebase",
      "Python",
      "GitHub",
      "FastAPI",
      "Figma",
    ],
    links: [
      {
        label: "View Demo",
        url: "https://www.linkedin.com/safety/go/?url=https%3A%2F%2Flnkd.in%2Fdy99sPHs&urlhash=pCnh&mt=bf7o6STi7oT8q29r1-mE2SdrZAiAxsSIzpbQGgfoDeechOSoVJDeXCSRIELUgZjAPIYvEBsZfG81hC-IKjDhuRMFEAP8GFR68j0TTa6UPEUkWWlwu34eRVY95mE&isSdui=true&lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3BWARbXYb2SKKEjKSjkpfy5w%3D%3D",
        icon: "▶",
        primary: true,
      },
      {
        label: "Download Poster",
        url: "https://drive.google.com/file/d/1vncwHe62l5ts6zxD1qibIyJdx2u4LTjX/view?usp=drive_link",
        icon: "⬇",
        primary: false,
      },
    ],
  },
  {
    id: "loan",
    name: "Loan Approval Prediction",
    subtitle: "Data Mining Course Project",
    date: "2025",
    image: "assets/icons/projects/loan.png",
    description:
      "Developed machine learning models to predict loan approval decisions. Performed data preprocessing including cleaning and feature engineering, then evaluated and compared Random Forest models using Python libraries such as Pandas and Scikit-learn.",
    tags: ["Python", "Pandas", "Scikit-learn", "Machine Learning"],
  },
  {
    id: "anis",
    name: "Anis App",
    subtitle: "Entertainment app for kidney patients",
    date: "2024",
    image: "assets/icons/projects/anis.png",
    description:
      "Focused on innovative UI/UX design to improve the patient experience, using creative thinking to design a user-friendly interface tailored to the emotional and practical needs of kidney patients.",
    tags: ["UI/UX Design", "Figma"],
  },
  {
    id: "golfcar",
    name: "Golf Car Management System",
    subtitle: "Advanced Programming Project",
    date: "2024",
    image: "assets/icons/projects/golfcar.png",
    description:
      "A Java-based platform for golf car reservations at King Abdulaziz University. Utilizes JFrames, Threads, Networking, and Exception Handling for seamless functionality and performance.",
    tags: ["Java", "Networking", "Multithreading"],
  },
];

function buildProjectListItem(project, isActive) {
  return `
    <div class="project-list-item ${isActive ? "is-active" : ""}" data-project-id="${project.id}" tabindex="0">
      <span class="project-list-icon">📁</span>
      <div class="project-list-text">
        <span class="project-list-name">${project.name}</span>
        <span class="project-list-date">${project.date}</span>
      </div>
    </div>
  `;
}

function buildProjectDetails(project) {
  const badgeHtml = project.badge
    ? `<span class="project-badge">${project.badge}</span>`
    : "";

  const linksHtml =
    project.links && project.links.length
      ? `<div class="project-details-links">${project.links
          .map(
            (link) =>
              `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="project-link-btn ${
                link.primary ? "is-primary" : "is-secondary"
              }"><span class="project-link-icon">${link.icon || "🔗"}</span>${link.label}</a>`
          )
          .join("")}</div>`
      : "";

  return `
    <div class="project-details" data-project-id="${project.id}">
      <div class="project-details-image-wrap">
        <img
          src="${project.image}"
          alt="${project.name}"
          class="project-details-image"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="project-details-image-fallback" style="display:none;">🗂️</div>
      </div>

      ${badgeHtml}
      <h3 class="project-details-title">${project.name}</h3>
      <p class="project-details-subtitle">${project.subtitle}</p>
      <span class="project-details-date">${project.date}</span>

      <p class="project-details-description">${project.description}</p>

      <div class="project-details-tags">
        ${project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("")}
      </div>

      ${linksHtml}
    </div>
  `;
}

window.FolderContent.projects = `
  <div class="projects-explorer">
    <div class="projects-list">
      ${PROJECTS_DATA.map((p, i) => buildProjectListItem(p, i === 0)).join("")}
    </div>
    <div class="projects-details-pane" id="projects-details-pane">
      ${buildProjectDetails(PROJECTS_DATA[0])}
    </div>
  </div>
`;

window.FolderInit.projects = function (windowEl) {
  const listItems = windowEl.querySelectorAll(".project-list-item");
  const detailsPane = windowEl.querySelector("#projects-details-pane");
  const listBox = windowEl.querySelector(".projects-list");

  function selectProject(id) {
    const project = PROJECTS_DATA.find((p) => p.id === id);
    if (!project || !detailsPane) return;

    detailsPane.innerHTML = buildProjectDetails(project);

    windowEl.querySelectorAll(".project-list-item").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.projectId === id);
    });

    refreshDetailsHint();
  }

  listItems.forEach((item) => {
    item.addEventListener("click", () => selectProject(item.dataset.projectId));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") selectProject(item.dataset.projectId);
    });
  });

  // ---------- Vertical scroll hint for the details pane (same as About Me) ----------
  function refreshDetailsHint() {
    if (!detailsPane) return;
    requestAnimationFrame(() => {
      const hasScrolledAtAll = detailsPane.scrollTop > 0;
      const hasMore =
        detailsPane.scrollHeight - detailsPane.scrollTop - detailsPane.clientHeight > 4;
      detailsPane.classList.toggle("has-scroll-hint", hasMore && !hasScrolledAtAll);
    });
  }

  try {
    if (detailsPane) {
      detailsPane.addEventListener("scroll", refreshDetailsHint, { passive: true });

      const observer = new MutationObserver(() => setTimeout(refreshDetailsHint, 50));
      observer.observe(detailsPane, { childList: true });

      setTimeout(refreshDetailsHint, 200);
    }
  } catch (err) {
    /* لا شيء */
  }

  // ---------- Horizontal scroll hint for the project list (mobile) ----------
  function refreshListHint() {
    if (!listBox) return;
    const hasScrolledAtAll = listBox.scrollLeft > 0;
    const hasMore =
      listBox.scrollWidth - listBox.scrollLeft - listBox.clientWidth > 6;
    listBox.classList.toggle("has-h-scroll-hint", hasMore && !hasScrolledAtAll);
  }

  try {
    if (listBox) {
      listBox.addEventListener("scroll", refreshListHint, { passive: true });
      window.addEventListener("resize", refreshListHint);
      setTimeout(refreshListHint, 200);
    }
  } catch (err) {
    /* لا شيء */
  }
};