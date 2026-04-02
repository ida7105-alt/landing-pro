export const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uSpeed;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 左右移動滑鼠時，uMouse.x 會偏移波浪相位，產生橫向推移感
    float waveX = sin(pos.x * uFrequency + uTime * uSpeed + uMouse.x * 0.5);
    float waveY = sin(pos.y * (uFrequency * 0.6) + uTime * (uSpeed * 0.8));
    
    float elevation = waveX * waveY * uAmplitude;
    pos.z += elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  varying vec2 vUv;
  uniform vec4 uColor;
  void main() {
    gl_FragColor = uColor;
  }
`;