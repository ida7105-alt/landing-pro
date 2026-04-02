import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';
import { vertexShader, fragmentShader } from './shader.js';
import { CONFIG } from './config.js';

let scene, camera, renderer, mesh, material;

function init() {
  scene = new THREE.Scene();
  
  // RWD 相機設定
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 2;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio); // 防止高解析度螢幕模糊
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  // 建立平面網格用於波浪
  const geometry = new THREE.PlaneGeometry(5, 5, 64, 64);
  material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Vector4(...CONFIG.color) },
      uAmplitude: { value: CONFIG.waveAmplitude },
      uFrequency: { value: CONFIG.waveFrequency },
      uSpeed: { value: CONFIG.waveSpeed }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    wireframe: true // 貝殼放大風格通常帶有線條感
  });

  mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 3; // 傾斜視角
  scene.add(mesh);

  window.addEventListener('resize', onWindowResize);
  animate();
  triggerLoadingSequence();
}

// RWD 核心：動態調整 Canvas 與 Camera
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.uTime.value += 0.01;
  renderer.render(scene, camera);
}

function triggerLoadingSequence() {
  setTimeout(() => {
    document.body.classList.add('is-loaded');
    // 動畫銜接：縮小 Logo 並讓波浪充滿螢幕
    mesh.scale.set(CONFIG.baseScale, CONFIG.baseScale, CONFIG.baseScale);
  }, CONFIG.transitionDelay);
}

init();