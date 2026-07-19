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
      "https://res.cloudinary.com/maz4meys/image/upload/v1784401115/Untitled_design_8_ba4ood.png",
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
    demoUrl: "https://lumin-demo-version.netlify.app/",
    posterFile: "assets/posters/lumin-poster.pdf",
  },

    {
    id: "petrolube",
    name: "Customer Complaint Management System",
    subtitle: "Petrolube Oil Company — Internship",
    date: "Jun – Aug 2025",
    image: "assets/icons/projects/petrolube-dashboard.png",
    description:
      "Redesigned Petrolube's customer complaint management process, replacing a manual, email- and spreadsheet-based workflow with a centralized, automated tracking portal built on Microsoft Power Platform. The system streamlines the full complaint lifecycle — from submission to investigation, escalation, and closure — with role-based portals, real-time dashboards, and automated SLA tracking and notifications.",
    tags: ["Power Apps", "Power Pages","Html", "CSS", "JavaScript"],
    letterFile: "assets/documents/petrolube-recommendation-letter.pdf",
  },
  
  {
    id: "loan",
    name: "Loan Approval Prediction",
    subtitle: "Data Mining Course Project",
    date: "2025",
    image: "https://res.cloudinary.com/maz4meys/image/upload/v1784405966/Untitled_design_11_tbhwmw.png",

    description:
      "Developed machine learning models to predict loan approval decisions. Performed data preprocessing including cleaning and feature engineering, then evaluated and compared Random Forest models using Python libraries such as Pandas and Scikit-learn.",
    tags: ["Python", "Pandas", "Scikit-learn", "Machine Learning"],
  },
  {
    id: "anis",
    name: "Anis App",
    subtitle: "Entertainment app for kidney patients",
    date: "2024",
    image: "https://res.cloudinary.com/maz4meys/image/upload/v1784406861/Untitled_design_17_uwyzqi.png",
    description:
      "Focused on innovative UI/UX design to improve the patient experience, using creative thinking to design a user-friendly interface tailored to the emotional and practical needs of kidney patients.",
    tags: ["UI/UX Design", "Figma"],
  },
  {
    id: "notey",
    name: "Notey",
    subtitle: "Notes & Folder Organizer App",
    date: "2024",
    video: "assets/videos/notey-demo.mp4",
    poster: "assets/videos/notey-poster.jpg",
    description:
      "Notey is a Flutter-based note-taking app that lets users create custom categories (folders) and organize notes inside each one. It features user authentication, an editable notes list, and real-time data sync. Built with Dart and powered by Firebase.",
    tags: ["Flutter", "Dart", "Firebase"],
  },


  {
    id: "todo",
    name: "Daily To-Do App",
    subtitle: "Simple Daily Task Manager",
    date: "2024",
    video: "assets/videos/todo-demo.mp4",
    poster: "assets/videos/todo-poster.jpg",
    description:
      "A simple and clean Flutter app for writing down and managing daily tasks — add, check off, and keep track of what needs to get done, all in one place.",
    tags: ["Flutter", "Dart"],
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

  const demoBtnHtml = project.demoUrl
    ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="about-pro-btn about-pro-btn-primary">View Demo<span class="about-pro-btn-arrow">→</span></a>`
    : "";

  const posterBtnHtml = project.posterFile
    ? `<button type="button" class="about-pro-btn about-pro-btn-secondary project-poster-btn" data-poster="${project.posterFile}"><span class="cv-btn-label">Download Poster</span><span class="cv-btn-check">✓</span></button>`
    : "";

  const letterBtnHtml = project.letterFile
    ? `<a href="${project.letterFile}" target="_blank" rel="noopener noreferrer" class="about-pro-btn about-pro-btn-primary">View Letter<span class="about-pro-btn-arrow">→</span></a>`
    : "";

  const linksHtml =
    demoBtnHtml || posterBtnHtml || letterBtnHtml
      ? `<div class="project-details-links">${demoBtnHtml}${posterBtnHtml}${letterBtnHtml}</div>`
      : "";

  const mediaHtml = project.video
    ? `
        <video
          src="${project.video}"
          ${project.poster ? `poster="${project.poster}"` : ""}
          class="project-details-video"
          controls
          playsinline
          preload="metadata"
        ></video>
      `
    : `
        <img
          src="${project.image}"
          alt="${project.name}"
          class="project-details-image"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="project-details-image-fallback" style="display:none;">🗂️</div>
      `;

  return `
    <div class="project-details" data-project-id="${project.id}">
      <div class="project-details-image-wrap">
        ${mediaHtml}
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
    attachPosterButton();
  }

  listItems.forEach((item) => {
    item.addEventListener("click", () => selectProject(item.dataset.projectId));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") selectProject(item.dataset.projectId);
    });
  });

  // ---------- Poster download: same confetti + checkmark celebration as CV ----------
  function spawnProjectConfetti(originEl) {
    const rect = originEl.getBoundingClientRect();
    const parentRect = windowEl.getBoundingClientRect();
    const originX = rect.left - parentRect.left + rect.width / 2;
    const originY = rect.top - parentRect.top + rect.height / 2;

    const colors = ["#e87a93", "#f3aebb", "#ffffff", "#ea8ea0", "#fbe4e9"];
    const pieceCount = 16;

    for (let i = 0; i < pieceCount; i++) {
      const piece = document.createElement("span");
      piece.className = "cv-confetti-piece";

      const angle = (Math.PI * 2 * i) / pieceCount + Math.random() * 0.5;
      const distance = 40 + Math.random() * 50;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 20;

      piece.style.left = `${originX}px`;
      piece.style.top = `${originY}px`;
      piece.style.setProperty("--dx", `${dx}px`);
      piece.style.setProperty("--dy", `${dy}px`);
      piece.style.background = colors[i % colors.length];
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;

      windowEl.appendChild(piece);
      setTimeout(() => piece.remove(), 900);
    }
  }

  function attachPosterButton() {
    const posterBtn = windowEl.querySelector(".project-poster-btn");
    if (!posterBtn) return;

    posterBtn.addEventListener("click", () => {
      const filePath = posterBtn.dataset.poster;
      if (!filePath) return;

      const link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      posterBtn.classList.add("is-downloaded");
      setTimeout(() => posterBtn.classList.remove("is-downloaded"), 2000);

      spawnProjectConfetti(posterBtn);
    });
  }

  attachPosterButton();

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