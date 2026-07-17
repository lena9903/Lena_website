/* ============================================
   Laptop Opening — Drag/Swipe-Scrubbed Frame Sequence
   (No page scroll involved at all — sidesteps every
   iOS Safari scroll/viewport quirk entirely. Progress
   is driven purely by pointer drag distance.)
   ============================================ */

const CONFIG = {
  frameCount: 130,
  frameFolder: "assets/laptop-sequence",
  framePrefix: "frame_",
  frameDigits: 4,
  frameExt: ".jpg",
  bgColor: "#0b0b0c",
  dragDistance: 500, // كم بكسل سحب لازم لإكمال الأنيميشن بالكامل (0 → 1)
  wheelSensitivity: 1 / 600, // حساسية عجلة الماوس (لدعم الكمبيوتر)
};

function getFramePath(index) {
  const num = String(index).padStart(CONFIG.frameDigits, "0");
  return `${CONFIG.frameFolder}/${CONFIG.framePrefix}${num}${CONFIG.frameExt}`;
}

const canvas = document.getElementById("laptop-canvas");
const ctx = canvas.getContext("2d");
const laptopSection = document.getElementById("laptop-section");
const dragHint = document.getElementById("drag-hint");

const images = [];

let canvasWidth = 0;
let canvasHeight = 0;
let currentFrameIndex = 0;

let progress = 0; // 0 إلى 1
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

/* ---------- Applying progress ---------- */

function setProgress(newProgress) {
  progress = Math.min(1, Math.max(0, newProgress));
  window.laptopScrollProgress = progress;

  const frame = Math.round(progress * (CONFIG.frameCount - 1));
  if (frame !== currentFrameIndex) {
    currentFrameIndex = frame;
    drawFrame(frame);
  }

  if (dragHint && progress > 0.03) {
    dragHint.classList.add("is-hidden");
  }
}

/* ---------- Pointer drag (touch + mouse, unified) ---------- */

let isDragging = false;
let dragStartX = 0;
let progressAtDragStart = 0;

laptopSection.addEventListener("pointerdown", (e) => {
  isDragging = true;
  dragStartX = e.clientX;
  progressAtDragStart = progress;
  laptopSection.setPointerCapture(e.pointerId);
});

laptopSection.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  const delta = e.clientX - dragStartX;
  setProgress(progressAtDragStart + delta / CONFIG.dragDistance);
});

function endDrag(e) {
  if (!isDragging) return;
  isDragging = false;
  try {
    laptopSection.releasePointerCapture(e.pointerId);
  } catch (err) {
    /* لا شيء — أحياناً الـ pointer خلص capture تلقائياً */
  }
}

laptopSection.addEventListener("pointerup", endDrag);
laptopSection.addEventListener("pointercancel", endDrag);

/* ---------- Mouse wheel / trackpad support (desktop) ---------- */

laptopSection.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    setProgress(progress + e.deltaY * CONFIG.wheelSensitivity);
  },
  { passive: false }
);

/* ---------- Responsive handling ---------- */

let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 150);
}

window.addEventListener("resize", handleResize);

document.addEventListener("DOMContentLoaded", () => {
  preloadImages(() => {
    setProgress(0);
  });
});