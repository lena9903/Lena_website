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

const SCROLL_LENGTH_VH = 150;

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

  // بيوقف مراقبة ScrollTrigger الداخلية لحدث "resize" تحديداً — هاي هي
  // نفسها المسؤولة عن القفزة للبداية على iOS Safari (شريط عنوان
  // المتصفح بيختفي = تغيّر بالارتفاع = ScrollTrigger كانت تسوي refresh
  // تلقائي من جوا، بغض النظر عن أي كود resize كتبناه إحنا).
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  const scrollEndPx = window.innerHeight * (SCROLL_LENGTH_VH / 100);

  gsap.to(playhead, {
    frame: CONFIG.frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#laptop-section",
      pin: true,
      start: "top top",
      end: "+=" + scrollEndPx,
      scrub: 0.15,
      anticipatePin: 1,
    },
    onUpdate: () => drawFrame(Math.round(playhead.frame)),
  });
}

/* ============================================
   Responsive handling (تغيير حجم نافذة حقيقي، ديسكتوب مثلاً)
   ============================================ */
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
  }, 150);
}

window.addEventListener("resize", handleResize);

document.addEventListener("DOMContentLoaded", () => {
  preloadImages(() => {
    initScrollAnimation();
  });
});