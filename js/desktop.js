/* ============================================
   DesktopManager — Windows-style interactive
   desktop that appears after the cinematic
   laptop-opening animation finishes.

   This file only READS globals already defined
   in scrollAnimation.js (canvas, images) — it
   never modifies that file or its animation.
   ============================================ */

/* ---------- Config ---------- */

const FOLDER_ICON_URL =
  "https://res.cloudinary.com/maz4meys/image/upload/v1784136778/pastel_yellow_macbook_folder_png-removebg-preview_v14ojh.png";

const FOLDERS = [
  { id: "about", label: "About Me" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

const SCREEN_RECT = { xPct: 0.143, yPct: 0.13, wPct: 0.724, hPct: 0.69 };
const WINDOW_SIZE_OVERRIDES = {
  about: { widthRatio: 0.92, maxWidth: 700, heightRatio: 0.94, maxHeight: 540 },
};

const MIN_WIN_WIDTH = 200;
const MIN_WIN_HEIGHT = 150;

const ICONS = {
  minimize: `<svg viewBox="0 0 10 10"><rect x="0" y="4.5" width="10" height="1" fill="currentColor"/></svg>`,
  maximize: `<svg viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
  restore: `<svg viewBox="0 0 10 10"><rect x="2.5" y="0.5" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1"/><rect x="0.5" y="2.5" width="7" height="7" fill="rgba(30,30,34,1)" stroke="currentColor" stroke-width="1"/></svg>`,
  close: `<svg viewBox="0 0 10 10"><line x1="0.5" y1="0.5" x2="9.5" y2="9.5" stroke="currentColor" stroke-width="1"/><line x1="9.5" y1="0.5" x2="0.5" y2="9.5" stroke="currentColor" stroke-width="1"/></svg>`,
};

/* ---------- DOM refs (assigned in initDesktop) ---------- */

let overlayEl, desktopIconsEl, desktopWindowsEl, desktopBackdropEl;

/* ---------- State ---------- */

const openWindows = new Map();
let zCounter = 10;

/* ---------- Helpers ---------- */

function clampPx(min, val, max) {
  return Math.max(min, Math.min(val, max));
}

// لازم تطابق تماماً منطق "contain" المستخدم بدالة drawFrame() بملف
// scrollAnimation.js (الأنيميشن الأساسية بدون قص/cover)
function computeImageContainRect() {
  const img = typeof images !== "undefined" ? images[0] : null;
  if (!img || !img.naturalWidth) return null;

  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = cw / ch;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    drawHeight = ch;
    drawWidth = ch * imgRatio;
    offsetX = (cw - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = cw;
    drawHeight = cw / imgRatio;
    offsetX = 0;
    offsetY = (ch - drawHeight) / 2;
  }

  return { offsetX, offsetY, drawWidth, drawHeight };
}

/* ---------- Positioning ---------- */

function positionOverlay() {
  if (!overlayEl) return;
  const rect = computeImageContainRect();
  if (!rect) return;

  const screenLeft = rect.offsetX + rect.drawWidth * SCREEN_RECT.xPct;
  const screenTop = rect.offsetY + rect.drawHeight * SCREEN_RECT.yPct;
  const screenWidth = rect.drawWidth * SCREEN_RECT.wPct;
  const screenHeight = rect.drawHeight * SCREEN_RECT.hPct;

  overlayEl.style.left = `${screenLeft}px`;
  overlayEl.style.top = `${screenTop}px`;
  overlayEl.style.width = `${screenWidth}px`;
  overlayEl.style.height = `${screenHeight}px`;

  const scaleW = clampPx(0.6, screenWidth / 1000, 1.6);
  const scaleH = clampPx(0.5, screenHeight / 560, 1.6);
  let scale = Math.min(scaleW, scaleH);

  const FOLDER_COUNT = FOLDERS.length;

  // نحسب الارتفاع المطلوب فعلياً بناءً على نفس المكونات يلي بترسمها CSS:
  // padding علوي/سفلي للخانة + حجم الأيقونة + مسافة + سطرين نص كحد أقصى
  function computeCellHeight(s) {
    const iconSize = clampPx(20, 46 * s, 60);
    const fontSize = clampPx(8, 11 * s, 13);
    const labelTwoLines = fontSize * 1.25 * 2; // -webkit-line-clamp: 2
    const cellPaddingVertical = 12; // 6px top + 6px bottom من CSS
    const labelMarginTop = 5;
    return cellPaddingVertical + iconSize + labelMarginTop + labelTwoLines;
  }

  const padTopEstimate = clampPx(6, 12 * scale, 16);
  const padBottomEstimate = clampPx(30, 46 * scale, 60);
  const availableHeight = screenHeight - padTopEstimate - padBottomEstimate;

  let cellHeight = computeCellHeight(scale);
  let gapEstimate = clampPx(2, 8 * scale, 14);
  let neededHeight = FOLDER_COUNT * cellHeight + (FOLDER_COUNT - 1) * gapEstimate;

  // لو ما كفت المساحة، منصغر scale تدريجياً (خطوات صغيرة) لحد ما يتساوى
  // الاحتياج مع المساحة المتاحة فعلياً — أدق من معادلة نسبة واحدة مباشرة
  let iterations = 0;
  while (neededHeight > availableHeight && scale > 0.15 && iterations < 30) {
    scale -= 0.02;
    cellHeight = computeCellHeight(scale);
    gapEstimate = clampPx(2, 8 * scale, 14);
    neededHeight = FOLDER_COUNT * cellHeight + (FOLDER_COUNT - 1) * gapEstimate;
    iterations++;
  }

  overlayEl.style.setProperty("--icon-rows", FOLDER_COUNT);
  overlayEl.style.setProperty("--icon-size", `${clampPx(20, 46 * scale, 60)}px`);
  overlayEl.style.setProperty("--icon-cell-width", `${clampPx(58, 92 * scale, 110)}px`);
  overlayEl.style.setProperty("--icon-cell", `${cellHeight}px`);
  overlayEl.style.setProperty("--icon-gap", `${gapEstimate}px`);
  overlayEl.style.setProperty("--icon-pad-top", `${padTopEstimate}px`);
  overlayEl.style.setProperty("--icon-pad-bottom", `${padBottomEstimate}px`);
  overlayEl.style.setProperty("--icon-pad-left", `${clampPx(10, 18 * scale, 26)}px`);
  overlayEl.style.setProperty("--icon-font", `${clampPx(8, 11 * scale, 13)}px`);
  overlayEl.style.setProperty("--header-h", `${clampPx(18, 28 * scale, 34)}px`);
  overlayEl.style.setProperty("--title-font", `${clampPx(9, 12 * scale, 13)}px`);
  overlayEl.style.setProperty("--content-font", `${clampPx(9, 12 * scale, 14)}px`);
  overlayEl.style.setProperty("--content-h3", `${clampPx(10, 14 * scale, 16)}px`);
}

/* ---------- Folder content ---------- */

function getFolderContent(id) {
  if (window.FolderContent && window.FolderContent[id]) {
    return window.FolderContent[id];
  }
  console.warn(`No content registered for folder "${id}" — check js/content/${id}.js`);
  return `<p>Content coming soon.</p>`;
}

/* ---------- FolderIcon ---------- */

function renderFolderIcons() {
  FOLDERS.forEach((folder) => {
    const iconEl = document.createElement("div");
    iconEl.className = "folder-icon";
    iconEl.dataset.folderId = folder.id;
    iconEl.tabIndex = 0;

    iconEl.innerHTML = `
      <div class="icon-box">
        <img src="${FOLDER_ICON_URL}" alt="${folder.label} folder" draggable="false" />
      </div>
      <span class="folder-label">${folder.label}</span>
    `;

    iconEl.addEventListener("click", () => openFolder(folder));
    iconEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openFolder(folder);
    });

    desktopIconsEl.appendChild(iconEl);
  });
}

/* ---------- DesktopWindow ---------- */

function createWindow(folder) {
  const el = document.createElement("div");
  el.className = "desktop-window";
  el.dataset.folderId = folder.id;

  const cascade = openWindows.size * 16;
  const override = WINDOW_SIZE_OVERRIDES[folder.id];

  const defaultWidth = override
    ? Math.min(overlayEl.clientWidth * override.widthRatio, override.maxWidth)
    : Math.min(overlayEl.clientWidth * 0.72, 340);

  const defaultHeight = override
    ? Math.min(overlayEl.clientHeight * override.heightRatio, override.maxHeight)
    : Math.min(overlayEl.clientHeight * 0.72, 240);

  const centerLeft = (overlayEl.clientWidth - defaultWidth) / 2 + cascade;
  const centerTop = (overlayEl.clientHeight - defaultHeight) / 2 + cascade;

  el.style.width = `${defaultWidth}px`;
  el.style.height = `${defaultHeight}px`;
  el.style.left = `${clampPx(0, centerLeft, Math.max(0, overlayEl.clientWidth - defaultWidth))}px`;
  el.style.top = `${clampPx(0, centerTop, Math.max(0, overlayEl.clientHeight - defaultHeight))}px`;

  el.innerHTML = `
    <div class="window-header" data-drag-handle>
      <span class="window-title">${folder.label}</span>
      <div class="window-controls">
        <button class="btn-min" title="Minimize" aria-label="Minimize">${ICONS.minimize}</button>
        <button class="btn-max" title="Maximize" aria-label="Maximize">${ICONS.maximize}</button>
        <button class="btn-close" title="Close" aria-label="Close">${ICONS.close}</button>
      </div>
    </div>
    <div class="window-content">${getFolderContent(folder.id)}</div>
    <div class="resize-handle rh-n" data-dir="n"></div>
    <div class="resize-handle rh-s" data-dir="s"></div>
    <div class="resize-handle rh-e" data-dir="e"></div>
    <div class="resize-handle rh-w" data-dir="w"></div>
    <div class="resize-handle rh-ne" data-dir="ne"></div>
    <div class="resize-handle rh-nw" data-dir="nw"></div>
    <div class="resize-handle rh-se" data-dir="se"></div>
    <div class="resize-handle rh-sw" data-dir="sw"></div>
  `;

  desktopWindowsEl.appendChild(el);
  requestAnimationFrame(() => el.classList.add("is-open"));

  el.querySelector(".btn-close").addEventListener("click", (e) => {
    e.stopPropagation();
    closeWindow(folder.id);
  });
  el.querySelector(".btn-min").addEventListener("click", (e) => {
    e.stopPropagation();
    minimizeWindow(folder.id);
  });
  el.querySelector(".btn-max").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMaximize(folder.id);
  });

  el.addEventListener("pointerdown", () => focusWindow(folder.id));

  enableDrag(el, el.querySelector(".window-header"));
  enableResize(el);

  if (window.FolderInit && typeof window.FolderInit[folder.id] === "function") {
    window.FolderInit[folder.id](el);
  }

  return el;
}

function enableDrag(windowEl, handleEl) {
  let dragging = false;
  let startX, startY, startLeft, startTop;

  handleEl.addEventListener("pointerdown", (e) => {
    if (windowEl.classList.contains("is-maximized")) return;
    if (e.target.closest(".window-controls")) return;

    dragging = true;
    handleEl.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
    startLeft = windowEl.offsetLeft;
    startTop = windowEl.offsetTop;
  });

  handleEl.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const maxLeft = Math.max(0, overlayEl.clientWidth - windowEl.offsetWidth);
    const maxTop = Math.max(0, overlayEl.clientHeight - windowEl.offsetHeight);

    windowEl.style.left = `${clampPx(0, startLeft + dx, maxLeft)}px`;
    windowEl.style.top = `${clampPx(0, startTop + dy, maxTop)}px`;
  });

  handleEl.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    handleEl.releasePointerCapture(e.pointerId);
  });
}

/* ---------- Resizing from edges/corners ---------- */

function enableResize(windowEl) {
  const handles = windowEl.querySelectorAll(".resize-handle");

  handles.forEach((handle) => {
    handle.addEventListener("pointerdown", (e) => {
      if (windowEl.classList.contains("is-maximized")) return;
      e.stopPropagation();
      e.preventDefault();

      const dir = handle.dataset.dir;
      handle.setPointerCapture(e.pointerId);

      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = windowEl.offsetLeft;
      const startTop = windowEl.offsetTop;
      const startWidth = windowEl.offsetWidth;
      const startHeight = windowEl.offsetHeight;

      function onMove(ev) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        let newLeft = startLeft;
        let newTop = startTop;
        let newWidth = startWidth;
        let newHeight = startHeight;

        if (dir.includes("e")) newWidth = startWidth + dx;
        if (dir.includes("s")) newHeight = startHeight + dy;
        if (dir.includes("w")) {
          newWidth = startWidth - dx;
          newLeft = startLeft + dx;
        }
        if (dir.includes("n")) {
          newHeight = startHeight - dy;
          newTop = startTop + dy;
        }

        if (newWidth < MIN_WIN_WIDTH) {
          if (dir.includes("w")) newLeft -= MIN_WIN_WIDTH - newWidth;
          newWidth = MIN_WIN_WIDTH;
        }
        if (newHeight < MIN_WIN_HEIGHT) {
          if (dir.includes("n")) newTop -= MIN_WIN_HEIGHT - newHeight;
          newHeight = MIN_WIN_HEIGHT;
        }

        newLeft = clampPx(0, newLeft, Math.max(0, overlayEl.clientWidth - newWidth));
        newTop = clampPx(0, newTop, Math.max(0, overlayEl.clientHeight - newHeight));
        newWidth = Math.min(newWidth, overlayEl.clientWidth - newLeft);
        newHeight = Math.min(newHeight, overlayEl.clientHeight - newTop);

        windowEl.style.left = `${newLeft}px`;
        windowEl.style.top = `${newTop}px`;
        windowEl.style.width = `${newWidth}px`;
        windowEl.style.height = `${newHeight}px`;
      }

      function onUp(ev) {
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
      }

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
    });
  });
}

/* ---------- DesktopManager ---------- */

/* Shows the blur backdrop whenever at least one non-minimized window is open */
function updateBackdrop() {
  if (!desktopBackdropEl) return;
  const hasVisibleWindow = [...openWindows.values()].some(
    (el) => !el.classList.contains("is-minimized")
  );
  desktopBackdropEl.classList.toggle("is-active", hasVisibleWindow);
}

function openFolder(folder) {
  if (openWindows.has(folder.id)) {
    openWindows.get(folder.id).classList.remove("is-minimized");
    focusWindow(folder.id);
    updateBackdrop();
    return;
  }
  const el = createWindow(folder);
  openWindows.set(folder.id, el);
  focusWindow(folder.id);
  updateBackdrop();
}

function closeWindow(id) {
  const el = openWindows.get(id);
  if (!el) return;
  el.classList.remove("is-open");
  setTimeout(() => el.remove(), 200);
  openWindows.delete(id);
  updateBackdrop();
}

function minimizeWindow(id) {
  const el = openWindows.get(id);
  if (el) el.classList.add("is-minimized");
  updateBackdrop();
}

function toggleMaximize(id) {
  const el = openWindows.get(id);
  if (!el) return;
  const btnMax = el.querySelector(".btn-max");

  if (el.classList.contains("is-maximized")) {
    el.classList.remove("is-maximized");
    el.style.left = el.dataset.prevLeft;
    el.style.top = el.dataset.prevTop;
    el.style.width = el.dataset.prevWidth;
    el.style.height = el.dataset.prevHeight;
    btnMax.innerHTML = ICONS.maximize;
    btnMax.title = "Maximize";
  } else {
    el.dataset.prevLeft = el.style.left;
    el.dataset.prevTop = el.style.top;
    el.dataset.prevWidth = el.style.width;
    el.dataset.prevHeight = el.style.height;
    el.classList.add("is-maximized");
    el.style.left = "0px";
    el.style.top = "0px";
    el.style.width = "100%";
    el.style.height = "100%";
    btnMax.innerHTML = ICONS.restore;
    btnMax.title = "Restore";
  }
}

function focusWindow(id) {
  const el = openWindows.get(id);
  if (!el) return;
  zCounter += 1;
  el.style.zIndex = zCounter;

  document.querySelectorAll(".folder-icon").forEach((f) => f.classList.remove("is-selected"));
  const iconEl = document.querySelector(`.folder-icon[data-folder-id="${id}"]`);
  if (iconEl) iconEl.classList.add("is-selected");
}

/* ---------- Show/hide overlay once the animation is fully finished ---------- */

function initDesktopScrollWatcher() {
  // ما عاد في scroll إطلاقاً — منراقب window.laptopScrollProgress
  // مباشرة عبر حلقة رسم مستمرة (نفس مبدأ requestAnimationFrame
  // المستخدم بملف scrollAnimation.js)
  function tick() {
    const progress = window.laptopScrollProgress || 0;
    const isComplete = progress >= 0.99;
    overlayEl.classList.toggle("is-active", isComplete);
    if (isComplete) positionOverlay();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Init ---------- */

let desktopResizeTimeout;
function handleDesktopResize() {
  clearTimeout(desktopResizeTimeout);
  desktopResizeTimeout = setTimeout(positionOverlay, 150);
}

function initDesktop() {
  overlayEl = document.getElementById("desktop-overlay");
  desktopIconsEl = document.getElementById("desktop-icons");
  desktopWindowsEl = document.getElementById("desktop-windows");
  desktopBackdropEl = document.getElementById("desktop-backdrop");

  renderFolderIcons();
  initDesktopScrollWatcher();
  positionOverlay();

  window.addEventListener("resize", handleDesktopResize);
  window.addEventListener("orientationchange", handleDesktopResize);
  window.addEventListener("load", positionOverlay);
}

document.addEventListener("DOMContentLoaded", initDesktop);