import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';
import { vertexShader, fragmentShader } from './shader.js';
import { CONFIG } from './config.js';

let scene, camera, renderer, mesh, material;
const mouse = { x: 0, y: 0 };
const targetMouse = { x: 0, y: 0 };

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2.5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const container = document.getElementById('canvas-container');
    if (container) container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(12, 12, 128, 128);
    material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
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
    mesh.rotation.x = -Math.PI / 2.5; // 預設傾斜
    scene.add(mesh);

    window.addEventListener('mousemove', (e) => {
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

    mouse.x += (targetMouse.x - mouse.x) * CONFIG.lerpSpeed;
    mouse.y += (targetMouse.y - mouse.y) * CONFIG.lerpSpeed;

    if (mesh) {
        // 關鍵：只改變 Y 軸（左右旋轉），X 軸（上下角度）維持固定
        mesh.rotation.y = mouse.x * CONFIG.mouseSensitivity;
        mesh.rotation.x = -Math.PI / 2.5; 
    }

    if (material) {
        material.uniforms.uTime.value += 0.01;
        material.uniforms.uMouse.value.set(mouse.x, mouse.y);
    }

    renderer.render(scene, camera);
}

init();