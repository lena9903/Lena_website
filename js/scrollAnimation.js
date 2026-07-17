/* ============================================
   Laptop Opening — Scroll-Scrubbed Frame Sequence
   (Pure vanilla JS — no external library, no "pin" magic.
   This sidesteps the GSAP ScrollTrigger + iOS Safari
   conflicts entirely.)
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

// آخر نسبة تقدم محسوبة (0 لـ 1) — متاحة عالمياً حتى desktop.js
// يقدر يعرف متى خلصت الأنيميشن بدون أي مكتبة وسيطة
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

/* ---------- Scroll-linked progress (no library) ---------- */

function getScrollProgress() {
  const rect = laptopSection.getBoundingClientRect();
  const totalScrollable = laptopSection.offsetHeight - window.innerHeight;
  if (totalScrollable <= 0) return 1;

  const scrolledPastTop = -rect.top;
  return Math.min(1, Math.max(0, scrolledPastTop / totalScrollable));
}

let tickScheduled = false;
function onScroll() {
  if (tickScheduled) return;
  tickScheduled = true;

  requestAnimationFrame(() => {
    const progress = getScrollProgress();
    window.laptopScrollProgress = progress;

    const frame = Math.round(progress * (CONFIG.frameCount - 1));
    if (frame !== currentFrameIndex) {
      currentFrameIndex = frame;
      drawFrame(frame);
    }

    tickScheduled = false;
  });
}

/* ---------- Responsive handling ---------- */

let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    onScroll();
  }, 150);
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", handleResize);

document.addEventListener("DOMContentLoaded", () => {
  preloadImages(() => {
    onScroll();
  });
});