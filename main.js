import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';
import { vertexShader, fragmentShader } from './shader.js';
import { CONFIG } from './config.js';

let scene, camera, renderer, mesh, material;

function init() {
    // 1. 初始化場景
    scene = new THREE.Scene();
    
    // 2. 相機設定 (RWD 關鍵)
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 2.5; // 拉遠一點確保看得到波浪

    // 3. 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 效能優化
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement);
    } else {
        console.error("找不到 #canvas-container 容器！");
        return;
    }

    // 4. 建立 3D 波浪物體 (Vertex Displacement)
    const geometry = new THREE.PlaneGeometry(10, 10, 128, 128); // 提高分段讓波浪細膩
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
        wireframe: true // 貝殼放大風格的網格線
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.5; // 傾斜視角產生立體感
    scene.add(mesh);

    // 5. 事件監聽
    window.addEventListener('resize', onWindowResize);
    
    // 6. 開始循環
    animate();
    
    // 模擬 Loading 完成後的縮小動態
    setTimeout(() => {
        document.body.classList.add('is-loaded');
        console.log("Animation sequence triggered.");
    }, CONFIG.transitionDelay);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (material) {
        material.uniforms.uTime.value += 0.01;
    }
    renderer.render(scene, camera);
}

// 確保 DOM 載入後執行
document.addEventListener('DOMContentLoaded', init);