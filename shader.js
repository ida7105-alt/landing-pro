export const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;

  uniform float uTime;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uSpeed;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 多重波疊加：創造有機的貝殼紋理感
    float waveX = sin(pos.x * uFrequency + uTime * uSpeed);
    float waveY = sin(pos.y * (uFrequency * 0.7) + uTime * (uSpeed * 0.6));
    
    // 二次諧波：增加波浪細節
    float harmonic = sin((pos.x + pos.y) * uFrequency * 1.2 + uTime * uSpeed) * 0.2;
    
    float elevation = (waveX * waveY + harmonic) * uAmplitude;
    
    pos.z += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform vec4 uColor;

  void main() {
    vec4 color = uColor;

    // 根據高度微調亮度，強化 3D 網格立體感
    float highlight = vElevation * 0.5 + 0.8;
    color.rgb *= highlight;
    
    gl_FragColor = color;
  }
`;