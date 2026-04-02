import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';
import { vertexShader, fragmentShader } from './shader.js';
import { CONFIG } from './config.js';

let scene, camera, renderer, mesh, material;
// 初始目標位置設為中心 (0, 0)
const mouse = { x: 0, y: 0 };
const targetMouse = { x: 0, y: 0 };

function init() {
    scene = new THREE.Scene();
    
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 3; // 稍微拉遠一點，讓旋轉效果更明顯

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement);
    }

    // 建立 3D 平面
    const geometry = new THREE.PlaneGeometry(12, 12, 100, 100);
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
        wireframe: true
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.5; // 基礎傾斜
    scene.add(mesh);

    // 強制監聽全螢幕的滑鼠移動
    window.addEventListener('mousemove', (e) => {
        // 核心邏輯：將滑鼠位置轉為 -1 ~ 1
        targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', onWindowResize);
    
    animate();

    setTimeout(() => {
        document.body.classList.add('is-loaded');
    }, CONFIG.transitionDelay);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // 慣性平滑計算 (Lerp)
    // 如果這裡沒動，代表 lerpSpeed 可能太小或 mouse 變數沒被更新
    mouse.x += (targetMouse.x - mouse.x) * CONFIG.lerpSpeed;
    mouse.y += (targetMouse.y - mouse.y) * CONFIG.lerpSpeed;

    if (mesh) {
        // 核心旋轉：基礎值 + 滑鼠偏移 * 靈敏度
        // y 軸旋轉控制左右，x 軸旋轉控制上下
        mesh.rotation.y = mouse.x * CONFIG.mouseSensitivity;
        mesh.rotation.x = (-Math.PI / 2.5) + (mouse.y * CONFIG.mouseSensitivity);
    }

    if (material) {
        material.uniforms.uTime.value += 0.01;
    }

    renderer.render(scene, camera);
}

// 啟動
init();