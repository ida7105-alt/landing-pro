const root = document.documentElement;
const grainCanvas = document.getElementById("grain");
const g = grainCanvas.getContext("2d", { alpha: true });

const tile = document.createElement("canvas");
const tileCtx = tile.getContext("2d", { alpha: true });

const state = {
  w: 0,
  h: 0,
  dpr: 1,
  frame: 0,
  mouse: { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false },
};

tile.width = 160;
tile.height = 160;

function resize() {
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.w = Math.floor(window.innerWidth * state.dpr);
  state.h = Math.floor(window.innerHeight * state.dpr);

  grainCanvas.width = state.w;
  grainCanvas.height = state.h;
  grainCanvas.style.width = "100%";
  grainCanvas.style.height = "100%";
}

function paintTile() {
  const img = tileCtx.createImageData(tile.width, tile.height);
  const data = img.data;

  for (let i = 0; i < data.length; i += 4) {
    const v = 18 + Math.random() * 120;
    const alpha = Math.random() < 0.5 ? 16 : 6;

    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = alpha;
  }

  tileCtx.putImageData(img, 0, 0);
}

function syncPointer() {
  const x = state.mouse.x;
  const y = state.mouse.y;

  root.style.setProperty("--mx", String((x - 0.5) * 2));
  root.style.setProperty("--my", String((y - 0.5) * 2));
}

function tick() {
  state.frame += 1;

  state.mouse.x += (state.mouse.tx - state.mouse.x) * 0.08;
  state.mouse.y += (state.mouse.ty - state.mouse.y) * 0.08;
  syncPointer();

  g.clearRect(0, 0, state.w, state.h);

  const pattern = g.createPattern(tile, "repeat");
  if (pattern) {
    g.save();
    g.globalAlpha = 0.045;
    g.translate(
      (state.mouse.x * 26 * state.dpr) % tile.width,
      (state.mouse.y * 26 * state.dpr) % tile.height
    );
    g.fillStyle = pattern;
    g.fillRect(-50, -50, state.w + 100, state.h + 100);
    g.restore();
  }

  const mx = state.mouse.x * state.w;
  const my = state.mouse.y * state.h;
  const radius = Math.min(state.w, state.h) * 0.42;

  const glow = g.createRadialGradient(mx, my, 0, mx, my, radius);
  glow.addColorStop(0, "rgba(255,255,255,0.18)");
  glow.addColorStop(0.18, "rgba(170,190,255,0.08)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, state.w, state.h);

  g.save();
  g.globalAlpha = 0.03;
  g.lineWidth = 1 * state.dpr;
  g.strokeStyle = "rgba(255,255,255,0.8)";

  for (let i = 0; i < 6; i += 1) {
    const y = ((state.frame * 0.36 + i * 150 * state.dpr) % state.h) - 80 * state.dpr;
    g.beginPath();
    g.moveTo(-80 * state.dpr, y);
    g.lineTo(state.w + 80 * state.dpr, y - 34 * state.dpr);
    g.stroke();
  }

  g.restore();

  requestAnimationFrame(tick);
}

window.addEventListener("resize", resize);

window.addEventListener("pointermove", (e) => {
  state.mouse.tx = e.clientX / window.innerWidth;
  state.mouse.ty = e.clientY / window.innerHeight;
  state.mouse.active = true;
});

window.addEventListener("pointerleave", () => {
  state.mouse.active = false;
  state.mouse.tx = 0.5;
  state.mouse.ty = 0.46;
});

window.addEventListener("DOMContentLoaded", () => {
  resize();
  paintTile();

  setInterval(paintTile, 90);
  requestAnimationFrame(tick);
});