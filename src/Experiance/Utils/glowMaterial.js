import * as THREE from "three";

export default function createGlowMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            glowColor: {value: new THREE.Color(0xffcc66)},
            glowStrength: {value: 0.0},
            time: {value: 0.0}
        },
        vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
        fragmentShader: `
    uniform vec3 glowColor;
    uniform float time;
    uniform float glowStrength;

    varying vec2 vUv;

    // Odległość od najbliższej krawędzi (0.0 - środek, 0.5 - krawędź)
    float edgeFade(vec2 uv) {
      vec2 fromEdge = min(uv, 1.0 - uv);
      float edgeDist = min(fromEdge.x, fromEdge.y);
      return smoothstep(0.02, 0.15, edgeDist); // im węższy zakres, tym ostrzejsza obwódka
    }

    void main() {
        vec2 uv = vUv;
    
        // Obliczamy dystans od krawędzi prostokąta z zaokrągleniem
        float border = 0.08; // grubość krawędzi
        float radius = 0.2;  // promień zaokrąglenia
    
        vec2 distToEdge = min(uv, 1.0 - uv);
        float softness = smoothstep(0.0, radius, min(distToEdge.x, distToEdge.y));
    
        // klasyczne wygaszenie od krawędzi
        float glow = smoothstep(1.0, 1.0 - border, max(distToEdge.x, distToEdge.y));
    
        // połączenie efektów
        float finalGlow = glow * softness;
    
        vec3 color = glowColor * finalGlow * glowStrength;
        gl_FragColor = vec4(color, finalGlow);
    }
  `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });
}