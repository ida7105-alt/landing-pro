const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});

let particles = [];
const cols = 160;
const rows = 60;
const gap = 10;

for (let x = 0; x < cols; x++) {
  for (let y = 0; y < rows; y++) {
    particles.push({
      x: x * gap,
      y: y * gap,
      baseY: y * gap
    });
  }
}

let time = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {

    // 波浪
    let wave =
      Math.sin((p.x + time) * 0.02) * 15 +
      Math.cos((p.y + time) * 0.015) * 10;

    // 滑鼠互動（更自然）
    let dx = p.x - mouse.x;
    let dy = p.y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    let force = 0;
    if (dist < 200) {
      force = (200 - dist) / 200;
    }

    let ripple = force * 40;

    let y = p.baseY + wave + ripple;

    // 發光效果
    ctx.beginPath();
    ctx.arc(p.x, y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "#4fc3f7";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#4fc3f7";
    ctx.fill();
  });

  time += 1.5;
  requestAnimationFrame(draw);
}

draw();