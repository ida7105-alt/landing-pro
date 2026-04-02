/**
 * shader.js - 處理 3D 波浪頂點位移與像素著色
 * * 核心邏輯：
 * 1. Vertex Shader: 利用正弦與餘弦波的交叉乘積 (Cross-product wave) 產生非線性的有機起伏。
 * 2. Fragment Shader: 輸出具體顏色與透明度，並可擴展加入簡單的邊緣發光 (Glow)。
 */

export const vertexShader = `
  varying vec2 vUv;
  varying float vElevation; // 將高度傳遞給 Fragment Shader，可用於根據高度改變亮度

  uniform float uTime;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uSpeed;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // --- 有機律動核心算法 ---
    // 使用兩組不同頻率與速度的波進行疊加，模擬貝殼波紋的層次感
    float waveX = sin(pos.x * uFrequency + uTime * uSpeed);
    float waveY = sin(pos.y * (uFrequency * 0.6) + uTime * (uSpeed * 0.8));
    
    // 加入微小的二次諧波，讓波浪邊緣更柔和，減少死板的機械感
    float harmonic = sin((pos.x + pos.y) * uFrequency * 0.5 + uTime * uSpeed) * 0.3;
    
    float elevation = (waveX * waveY + harmonic) * uAmplitude;
    
    pos.z += elevation;
    vElevation = elevation; // 紀錄高度值

    // 轉換為投影座標
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;

  uniform vec4 uColor; // 從 config.js 傳進來的 [1.0, 1.0, 1.0, 0.5]

  void main() {
    // 基礎顏色
    vec4 color = uColor;

    // --- 視覺優化 (可選) ---
    // 根據波浪高度稍微調整透明度，讓高處看起來亮一點，增加 3D 立體感
    float depthEffect = vElevation * 0.5 + 0.8;
    color.a *= depthEffect;

    gl_FragColor = color;
  }
`;