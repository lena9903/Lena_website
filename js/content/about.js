/* ============================================
   Folder Content — About Me (Professional)
   ============================================ */

window.FolderContent = window.FolderContent || {};
window.FolderInit = window.FolderInit || {};

window.FolderContent.about = `
  <div class="about-pro">

    <!-- Left: Profile Image — rectangular, full height -->
    <div class="about-pro-left">
      <div class="about-pro-image-wrapper">
        <img
          src="https://res.cloudinary.com/maz4meys/image/upload/v1784232257/ChatGPT_Image_Jul_16_2026_11_03_33_PM_l4ltax.png"
          alt="Lena Abdulrazak"
          class="about-pro-image"
        />
      </div>
    </div>

    <!-- Right: Content -->
    <div class="about-pro-right">
      <h1 class="about-pro-greeting">Hello, I'm Lena <span class="about-pro-emoji">🌷</span></h1>

    <div class="about-pro-typing-line">
        <span class="about-pro-prefix">I'm</span>
        <span class="about-pro-article" id="about-article-text">an</span>
        <span class="about-pro-typing" id="about-typing-text"></span>
        <span class="about-pro-cursor">|</span>
      </div>

      <p class="about-pro-bio">
        A fresh Information Technology graduate passionate about
        <span class="about-pro-highlight">Artificial Intelligence</span> and
        <span class="about-pro-highlight-flutter">Flutter development</span>.
        I enjoy creating intuitive digital experiences and turning
        ideas into practical applications.
      </p>

      <div class="about-pro-footer">
        <div class="about-pro-status">
          <span class="about-pro-status-dot"></span>
          Available for Opportunities
        </div>
      </div>
<div class="about-pro-buttons">
        <button class="about-pro-btn about-pro-btn-primary" id="about-contact-btn">
          Get in Touch
          <span class="about-pro-btn-arrow">→</span>
        </button>
        <button class="about-pro-btn about-pro-btn-secondary">
          Download CV
        </button>
      </div>
    </div>

  </div>
`;
window.FolderInit.about = function (windowEl) {
const roles = ["App Developer", "AI Enthusiast"];
  let currentRoleIndex = 0;
  let isDeleting = false;
  let charIndex = 0;

  const typingEl = windowEl.querySelector("#about-typing-text");
  const articleEl = windowEl.querySelector("#about-article-text");
  if (!typingEl || !articleEl) return;

  function updateArticle(role) {
    const startsWithVowelSound = /^[AEIOU]/i.test(role);
    articleEl.textContent = startsWithVowelSound ? "an" : "a";
  }

  function type() {
    const currentRole = roles[currentRoleIndex];

    if (!isDeleting && charIndex === 0) {
      updateArticle(currentRole); // sets "a"/"an" right as the new word starts typing
    }

    if (!isDeleting && charIndex < currentRole.length) {
      typingEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(type, 80);
    } else if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(type, 1200);
    } else if (isDeleting && charIndex > 0) {
      typingEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(type, 50);
    } else {
      isDeleting = false;
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      setTimeout(type, 500);
    }
  }

  type();

  const btn = windowEl.querySelector("#about-contact-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      if (typeof openFolder === "function") {
        openFolder({ id: "contact", label: "Contact" });
      }
    });
  }

// ---------- Scroll hint: shows/hides automatically based on scroll position ----------
  try {
    const scrollBox = windowEl.querySelector(".window-content");
    if (scrollBox) {
      function refreshScrollHint() {
        const hasMore =
          scrollBox.scrollHeight - scrollBox.scrollTop - scrollBox.clientHeight > 6;
        scrollBox.classList.toggle("has-scroll-hint", hasMore);
      }
      scrollBox.addEventListener("scroll", refreshScrollHint, { passive: true });
      setTimeout(refreshScrollHint, 200);
    }
  } catch (err) {
    /* أي خطأ هون ما بأثر على باقي الصفحة إطلاقاً */
  }
};