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
    image: "assets/icons/projects/lumin.png", // ضيفي الصورة بهالمسار
    description:
      "A smart recommendation engine that analyzes solar production and device consumption data to suggest the optimal time and device for solar-powered operation. Includes an automated scheduler delivering personalized energy-saving tips on a weekly cadence, with real-time push notifications via Firebase Cloud Messaging.",
    tags: ["Flutter", "Firebase", "Supabase", "Machine Learning"],
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

      <h3 class="project-details-title">${project.name}</h3>
      <p class="project-details-subtitle">${project.subtitle}</p>
      <span class="project-details-date">${project.date}</span>

      <p class="project-details-description">${project.description}</p>

      <div class="project-details-tags">
        ${project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("")}
      </div>
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
    const hasScrolledAtAll = detailsPane.scrollTop > 0;
    const hasMore =
      detailsPane.scrollHeight - detailsPane.scrollTop - detailsPane.clientHeight > 6;
    detailsPane.classList.toggle("has-scroll-hint", hasMore && !hasScrolledAtAll);
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