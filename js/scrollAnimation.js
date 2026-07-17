/* ============================================
   Laptop Opening — Scroll-Scrubbed Frame Sequence
   ============================================ */

const CONFIG = {
  frameCount: 130,
  frameFolder: "assets/laptop-sequence",
  framePrefix: "frame_",
  frameDigits: 4,
  frameExt: ".jpg",
  bgColor: "#0b0b0c", // لازم يطابق --color-bg بملف variables.css
};

function getFramePath(index) {
  const num = String(index).padStart(CONFIG.frameDigits, "0");
  return `${CONFIG.frameFolder}/${CONFIG.framePrefix}${num}${CONFIG.frameExt}`;
}

const canvas = document.getElementById("laptop-canvas");
const ctx = canvas.getContext("2d");

const images = [];
const playhead = { frame: 0 };

let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvasWidth = canvas.clientWidth;
  canvasHeight = canvas.clientHeight;

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawFrame(Math.round(playhead.frame));
}

function drawFrame(index) {
  const img = images[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  // خلفية موحّدة تملأ أي شريط فاضي (letterbox) حتى ينسجم مع خلفية الصفحة
  ctx.fillStyle = CONFIG.bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // "contain" fit: يعرض الصورة كاملة دايماً بدون أي قص،
  // حتى على شاشات ضيقة وطويلة جداً (موبايل)
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * imgRatio;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function preloadImages(onFirstFrameReady) {
  for (let i = 0; i < CONFIG.frameCount; i++) {
    const img = new Image();
    img.src = getFramePath(i + 1);

    if (i === 0) {
      img.onload = () => {
        resizeCanvas();
        if (onFirstFrameReady) onFirstFrameReady();
      };
    }

    images.push(img);
  }
}

function initScrollAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(playhead, {
    frame: CONFIG.frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#laptop-section",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
    },
    onUpdate: () => drawFrame(Math.round(playhead.frame)),
  });
}

/* ============================================
   Responsive handling
   - debounced resize: يمنع استدعاءات متكررة زيادة عن اللزوم
     وقت السحب (drag) لتغيير حجم النافذة أو ظهور/اختفاء
     شريط عنوان المتصفح على الموبايل
   - ScrollTrigger.refresh(): يعيد حساب مسافة السكرول بعد أي
     تغيّر بارتفاع الأقسام (مثلاً عند تفعيل breakpoint مختلف)
   ============================================ */
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }, 150);
}

window.addEventListener("resize", handleResize);
window.addEventListener("orientationchange", handleResize);

document.addEventListener("DOMContentLoaded", () => {
  preloadImages(() => {
    initScrollAnimation();
  });
});