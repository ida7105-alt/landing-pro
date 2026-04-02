export const vertexShader = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = vec4(position,1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;

  uniform float uStrength;
  uniform float uFrequency;
  uniform float uSpeed;
  uniform float uNoise;
  uniform float uGlow;

  varying vec2 vUv;

  void main(){
    vec2 uv = vUv;

    float dist = distance(uv, uMouse);

    float ripple = sin(dist * uFrequency - uTime * uSpeed);
    float strength = smoothstep(0.4, 0.0, dist);

    uv += normalize(uv - uMouse) * ripple * uStrength * strength;

    uv.x += sin(uv.y * 10.0 + uTime) * uNoise;
    uv.y += cos(uv.x * 10.0 + uTime) * uNoise;

    vec4 color = texture2D(uTexture, uv);

    float glow = smoothstep(0.4, 0.0, dist);
    color.rgb += glow * uGlow;

    gl_FragColor = color;
  }
`;