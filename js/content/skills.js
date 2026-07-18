/* ============================================
   Folder Content — Skills
   Each skill appears as a "file" icon (real logo)
   matching the desktop's Windows-file aesthetic.
   ============================================ */

window.FolderContent = window.FolderContent || {};
window.FolderInit = window.FolderInit || {};

const SKILLS_ICON_PATH = "assets/icons/skills/";

const AI_SKILLS = [
  { name: "Pandas", img: "pandas.png" },
  { name: "NumPy", img: "numpy.png" },
  { name: "Python", img: "python.png" }, // ناقصة الصورة — ضيفيها بنفس المسار
  { name: "PyTorch", img: "pytorch.png" },
  { name: "Scikit-learn", img: "scikit-learn.png" },
];

const APP_DEV_SKILLS = [
  { name: "Flutter", img: "flutter.png" },
  { name: "Supabase", img: "supabase.png" },
  { name: "Dart", img: "dart.png" },
  { name: "Firebase", img: "firebase.png" },
];

const OTHER_SKILLS = [
  { name: "Java", img: "java.png" },
  { name: "GitHub", img: "github.png" }, // ناقصة الصورة — ضيفيها بنفس المسار
  { name: "VS Code", img: "vscode.webp" },
  { name: "Figma", img: "figma.png" },
];

function buildSkillFile(skill, index) {
  return `
    <div class="skill-file" style="--stagger-index: ${index}">
      <div class="skill-file-icon">
        <span class="skill-file-fold"></span>
        <img
          src="${SKILLS_ICON_PATH}${skill.img}"
          alt="${skill.name}"
          class="skill-file-logo"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <span class="skill-file-fallback" style="display:none;">📄</span>
      </div>
      <span class="skill-file-name">${skill.name}</span>
    </div>
  `;
}

window.FolderContent.skills = `
  <div class="skills-explorer">
    <div class="skills-group">
      <div class="skills-group-header">Artificial Intelligence</div>
      <div class="skills-grid">
        ${AI_SKILLS.map((s, i) => buildSkillFile(s, i)).join("")}
      </div>
    </div>

    <div class="skills-group">
      <div class="skills-group-header">App Development</div>
      <div class="skills-grid">
        ${APP_DEV_SKILLS.map((s, i) => buildSkillFile(s, i)).join("")}
      </div>
    </div>

    <div class="skills-group">
      <div class="skills-group-header">Other</div>
      <div class="skills-grid">
        ${OTHER_SKILLS.map((s, i) => buildSkillFile(s, i)).join("")}
      </div>
    </div>
  </div>
`;

window.FolderInit.skills = function (windowEl) {
  // ---------- Scroll hint: shows/hides automatically based on scroll position ----------
  try {
    const scrollBox = windowEl.querySelector(".window-content");
    if (scrollBox) {
      function refreshScrollHint() {
        const hasScrolledAtAll = scrollBox.scrollTop > 0;
        const hasMore =
          scrollBox.scrollHeight - scrollBox.scrollTop - scrollBox.clientHeight > 6;
        scrollBox.classList.toggle("has-scroll-hint", hasMore && !hasScrolledAtAll);
      }
      scrollBox.addEventListener("scroll", refreshScrollHint, { passive: true });
      setTimeout(refreshScrollHint, 200);
    }
  } catch (err) {
    /* أي خطأ هون ما بأثر على باقي الصفحة إطلاقاً */
  }
};