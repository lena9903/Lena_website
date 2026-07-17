/* ============================================
   Laptop Opening — Scroll-Scrubbed Frame Sequence
   ============================================ */

const CONFIG = {
  frameCount: 130,
  frameFolder: "assets/laptop-sequence",
  framePrefix: "frame_",
  frameDigits: 4,
  frameExt: ".jpg",
  bgColor: "#0b0b0c",
};

// كم ضعف من ارتفاع الشاشة تاخذ مسافة السكرول الكاملة للأنيميشن.
// دالة (function) بدل رقم ثابت حتى GSAP تعيد حسابها صح عند أي
// تغيّر بحجم الشاشة (بما فيها اختفاء/ظهور شريط عنوان الموبايل).
const SCROLL_LENGTH_VH = 50;
function getScrollEnd() {
  return "+=" + window.innerHeight * (SCROLL_LENGTH_VH / 100);
}

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

  ctx.fillStyle = CONFIG.bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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
    ScrollTrigger.config({ ignoreMobileResize: true });

  gsap.to(playhead, {
    frame: CONFIG.frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#laptop-section",
      pin: true,            // GSAP نفسها بتثبت العنصر وبتضيف مسافة السكرول اللازمة تلقائياً
      start: "top top",
      end: getScrollEnd,    // دالة بتتحسب من جديد تلقائياً عند أي refresh
      scrub: 0.15,
      anticipatePin: 1,
    },
    onUpdate: () => drawFrame(Math.round(playhead.frame)),
  });
}

/* ============================================
   Responsive handling
   ============================================ */
/* ============================================
   Responsive handling
   ============================================ */
let resizeTimeout;
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;

function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    const widthChanged = newWidth !== lastWidth;
    // فرق كبير بالارتفاع (أكتر من 120px) = تدوير شاشة حقيقي أو تغيير
    // نافذة فعلي. فرق بسيط = مجرد ظهور/اختفاء شريط عنوان المتصفح
    // بالموبايل، وهاد لازم نتجاهله تماماً حتى ما يصير القفزة للبداية
    const heightChangedSignificantly = Math.abs(newHeight - lastHeight) > 120;

    if (!widthChanged && !heightChangedSignificantly) {
      return; // تجاهل تام — على الأغلب شريط عنوان المتصفح بس
    }

    lastWidth = newWidth;
    lastHeight = newHeight;

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