import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';
import { vertexShader, fragmentShader } from './shader.js';
import { CONFIG } from './config.js';

let scene, camera, renderer, mesh, material;
const mouse = { x: 0, y: 0 };
const targetMouse = { x: 0, y: 0 };

function init() {
    // 1. 場景與相機
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2.5;

    // 2. 渲染器設定 (處理 RWD 與高解析度)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const container = document.getElementById('canvas-container');
    if (container) container.appendChild(renderer.domElement);

    // 3. 建立 3D 網格 (使用 ShaderMaterial)
    const geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
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
        wireframe: true // 關鍵：呈現貝殼放大風格的網格線
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.5; // 預設傾斜視角
    scene.add(mesh);

    // 4. 事件監聽
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    
    animate();

    // 5. 執行進場序列
    setTimeout(() => {
        document.body.classList.add('is-loaded');
    }, CONFIG.transitionDelay);
}

function onMouseMove(event) {
    // 座標歸一化 (-1 to 1)
    targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // 滑鼠慣性緩動 (Lerp)
    mouse.x += (targetMouse.x - mouse.x) * CONFIG.lerpSpeed;
    mouse.y += (targetMouse.y - mouse.y) * CONFIG.lerpSpeed;

    if (mesh) {
        // 根據滑鼠位置產生輕微傾斜互動
        mesh.rotation.y = mouse.x * CONFIG.mouseSensitivity;
        mesh.rotation.x = (-Math.PI / 2.5) + (mouse.y * CONFIG.mouseSensitivity);
    }

    if (material) {
        material.uniforms.uTime.value += 0.01;
    }

    renderer.render(scene, camera);
}

// 確保 DOM 載入後啟動
if (document.readyState === 'complete') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}