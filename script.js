// ===== 基本設定 =====
const canvas = document.getElementById("grain");
const ctx = canvas.getContext("2d");

let w, h, dpr;
let mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
let time = 0;

// ===== resize =====
function resize() {
  dpr = Math.min(window.devicePixelRatio, 2);
  w = canvas.width = window.innerWidth * dpr;
  h = canvas.height = window.innerHeight * dpr;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
}
resize();
window.addEventListener("resize", resize);

// ===== 滑鼠 =====
window.addEventListener("pointermove", (e) => {
  mouse.tx = e.clientX / window.innerWidth;
  mouse.ty = e.clientY / window.innerHeight;
});

// ===== Landing Bar =====
const bar = document.querySelector(".poster__bar span");

window.addEventListener("load", () => {
  bar.style.width = "100%";

  document.body.animate(
    [
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)" },
    ],
    {
      duration: 1200,
      easing: "cubic-bezier(0.22,1,0.36,1)",
      fill: "forwards",
    }
  );
});

// ===== 主動畫 =====
function animate() {
  requestAnimationFrame(animate);

  time += 0.03;

  // 平滑滑鼠
  mouse.x += (mouse.tx - mouse.x) * 0.08;
  mouse.y += (mouse.ty - mouse.y) * 0.08;

  ctx.clearRect(0, 0, w, h);

  // ===== 動態顆粒（照片感）=====
  const img = ctx.createImageData(120, 120);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + Math.random() * 100;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 18;
  }

  const temp = document.createElement("canvas");
  temp.width = 120;
  temp.height = 120;
  temp.getContext("2d").putImageData(img, 0, 0);

  const pattern = ctx.createPattern(temp, "repeat");

  ctx.save();
  ctx.globalAlpha = 0.05;

  ctx.translate(
    (mouse.x * 30 * dpr) % 120,
    (mouse.y * 30 * dpr) % 120
  );

  ctx.fillStyle = pattern;
  ctx.fillRect(-50, -50, w + 100, h + 100);
  ctx.restore();

  // ===== 波紋（核心升級）=====
  const mx = mouse.x * w;
  const my = mouse.y * h;

  for (let i = 0; i < 3; i++) {
    const r = (time * 60 + i * 120) % (w * 0.8);

    const gradient = ctx.createRadialGradient(
      mx,
      my,
      r * 0.2,
      mx,
      my,
      r
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.12)");
    gradient.addColorStop(0.3, "rgba(160,180,255,0.08)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // ===== 微光暈 =====
  const glow = ctx.createRadialGradient(mx, my, 0, mx, my, w * 0.4);
  glow.addColorStop(0, "rgba(255,255,255,0.15)");
  glow.addColorStop(1, "transparent");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}

animate();