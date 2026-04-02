import { CONFIG } from "./config.js";
import { vertexShader, fragmentShader } from "./shader.js";

const canvas = document.getElementById("grain");

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// ===== 滑鼠 =====
let mouse = { x: 0.5, y: 0.5 };

window.addEventListener("pointermove", (e) => {
  mouse.x = e.clientX / window.innerWidth;
  mouse.y = 1 - e.clientY / window.innerHeight;
});

// ===== texture =====
const texture = new THREE.TextureLoader().load(CONFIG.image);

// ===== material =====
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 },

    uStrength: { value: CONFIG.ripple.strength },
    uFrequency: { value: CONFIG.ripple.frequency },
    uSpeed: { value: CONFIG.ripple.speed },
    uNoise: { value: CONFIG.noise.strength },
    uGlow: { value: CONFIG.glow.intensity },
  },
  vertexShader,
  fragmentShader,
});

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(mesh);

// ===== animate =====
function animate() {
  requestAnimationFrame(animate);

  material.uniforms.uTime.value += 0.03;
  material.uniforms.uMouse.value.set(mouse.x, mouse.y);

  renderer.render(scene, camera);
}
animate();

// ===== resize =====
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});