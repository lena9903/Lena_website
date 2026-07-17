/* ============================================
   Laptop Opening — Scroll-Scrubbed Frame Sequence
   (Pure vanilla JS, no external library, with
   smoothing to eliminate touch-scroll jitter)
   ============================================ */

const CONFIG = {
  frameCount: 130,
  frameFolder: "assets/laptop-sequence",
  framePrefix: "frame_",
  frameDigits: 4,
  frameExt: ".jpg",
  bgColor: "#0b0b0c",
};

function getFramePath(index) {
  const num = String(index).padStart(CONFIG.frameDigits, "0");
  return `${CONFIG.frameFolder}/${CONFIG.framePrefix}${num}${CONFIG.frameExt}`;
}

const canvas = document.getElementById("laptop-canvas");
const ctx = canvas.getContext("2d");
const laptopSection = document.getElementById("laptop-section");

const images = [];

let canvasWidth = 0;
let canvasHeight = 0;
let currentFrameIndex = 0;

// الهدف (الرقم الخام من السكرول) مقابل القيمة المعروضة فعلياً
// (بتتحرك بسلاسة وراء الهدف بدل ما تقفز له مباشرة — بيلغي أي رجفة)
let targetProgress = 0;
let displayProgress = 0;

window.laptopScrollProgress = 0;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvasWidth = canvas.clientWidth;
  canvasHeight = canvas.clientHeight;

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawFrame(currentFrameIndex);
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

/* ---------- Raw scroll progress ---------- */

function computeTargetProgress() {
  const rect = laptopSection.getBoundingClientRect();
  const totalScrollable = laptopSection.offsetHeight - window.innerHeight;

  if (totalScrollable <= 0) return 0;

  const scrolledPastTop = -rect.top;
  const raw = scrolledPastTop / totalScrollable;

  if (!isFinite(raw)) return targetProgress;

  return Math.min(1, Math.max(0, raw));
}

function onScrollOrResize() {
  targetProgress = computeTargetProgress();
}

/* ---------- Smoothing loop (kills touch jitter) ---------- */

const SMOOTHING = 0.18;

function renderLoop() {
  displayProgress += (targetProgress - displayProgress) * SMOOTHING;

  if (Math.abs(targetProgress - displayProgress) < 0.0005) {
    displayProgress = targetProgress;
  }

  window.laptopScrollProgress = displayProgress;

  const frame = Math.round(displayProgress * (CONFIG.frameCount - 1));
  if (frame !== currentFrameIndex) {
    currentFrameIndex = frame;
    drawFrame(frame);
  }

  requestAnimationFrame(renderLoop);
}

/* ---------- Responsive handling ---------- */

let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    onScrollOrResize();
  }, 150);
}

window.addEventListener("scroll", onScrollOrResize, { passive: true });
window.addEventListener("resize", handleResize);

document.addEventListener("DOMContentLoaded", () => {
  preloadImages(() => {
    onScrollOrResize();
    displayProgress = targetProgress;
    requestAnimationFrame(renderLoop);

    setTimeout(() => {
      resizeCanvas();
      onScrollOrResize();
    }, 300);
  });
});