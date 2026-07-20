/* ============================================
   Folder Content — Achievements
   Certificate / award gallery grid.
   ============================================ */

window.FolderContent = window.FolderContent || {};
window.FolderInit = window.FolderInit || {};

/* أضيفي هون كل شهادة/جائزة — لسا فاضية، جاهزة تستقبل الصور */
const ACHIEVEMENTS_DATA = [
  // مثال لما تضيفي صورة:
  // {
  //   id: "jeddah-hackathon",
  //   title: "Jeddah Hackathon",
  //   subtitle: "1st Place",
  //   image: "assets/icons/achievements/jeddah-hackathon.jpg",
  // },
];

function buildAchievementCard(item) {
  return `
    <div class="achievement-card" data-full-image="${item.image}" tabindex="0">
      <div class="achievement-image-wrap">
        <img src="${item.image}" alt="${item.title}" class="achievement-image" />
      </div>
      <div class="achievement-caption">
        <p class="achievement-title">${item.title}</p>
        ${item.subtitle ? `<span class="achievement-subtitle">${item.subtitle}</span>` : ""}
      </div>
    </div>
  `;
}

window.FolderContent.achievements =
  ACHIEVEMENTS_DATA.length > 0
    ? `
      <div class="achievements-gallery">
        ${ACHIEVEMENTS_DATA.map(buildAchievementCard).join("")}
      </div>
    `
    : `
      <div class="achievements-gallery">
        <div class="achievements-empty">
          <span class="achievements-empty-icon">🏆</span>
          <p>Certificates & awards coming soon.</p>
        </div>
      </div>
    `;

window.FolderInit.achievements = function (windowEl) {
  const cards = windowEl.querySelectorAll(".achievement-card");

  cards.forEach((card) => {
    function openLightbox() {
      const imgSrc = card.dataset.fullImage;
      if (!imgSrc) return;

      const lightbox = document.createElement("div");
      lightbox.className = "achievement-lightbox";
      lightbox.innerHTML = `<img src="${imgSrc}" alt="" />`;
      lightbox.addEventListener("click", () => lightbox.remove());
      document.body.appendChild(lightbox);
    }

    card.addEventListener("click", openLightbox);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openLightbox();
    });
  });
};