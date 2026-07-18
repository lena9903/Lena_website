/* ============================================
   Folder Content — Skills
   Each skill appears as a "file" icon, matching
   the desktop's Windows-file aesthetic.
   ============================================ */

window.FolderContent = window.FolderContent || {};
window.FolderInit = window.FolderInit || {};

const HARD_SKILLS = [
  { name: "Python", icon: "🐍" },
  { name: "Java", icon: "☕" },
  { name: "Dart", icon: "🎯" },
  { name: "Flutter", icon: "💠" },
  { name: "SQL", icon: "🗄️" },
  { name: "Machine Learning", icon: "🤖" },
  { name: "PyTorch", icon: "🔥" },
];

const SOFT_SKILLS = [
  { name: "Communication", icon: "💬" },
  { name: "Problem-Solving", icon: "🧩" },
  { name: "Management", icon: "📊" },
  { name: "Leadership", icon: "🌟" },
  { name: "Presentation Skills", icon: "🎤" },
];

function buildSkillFile(skill) {
  return `
    <div class="skill-file">
      <div class="skill-file-icon">
        <span class="skill-file-fold"></span>
        <span class="skill-file-emoji">${skill.icon}</span>
      </div>
      <span class="skill-file-name">${skill.name}</span>
    </div>
  `;
}

window.FolderContent.skills = `
  <div class="skills-explorer">
    <div class="skills-group">
      <div class="skills-group-header">Hard Skills</div>
      <div class="skills-grid">
        ${HARD_SKILLS.map(buildSkillFile).join("")}
      </div>
    </div>

    <div class="skills-group">
      <div class="skills-group-header">Soft Skills</div>
      <div class="skills-grid">
        ${SOFT_SKILLS.map(buildSkillFile).join("")}
      </div>
    </div>
  </div>
`;