import * as THREE from "three";
// Glow ShaderMaterial with noise (Three.js custom shader)
const magicUniforms = {
    time: {value: 0},
    glowColor: {value: new THREE.Color(0xffcc66)},
    distortionStrength: {value: 1}
};


export default new THREE.ShaderMaterial({
    uniforms: magicUniforms,
    vertexShader: `
    uniform float time;

    attribute float angle;
    attribute float offset;
    attribute float frequency;
    attribute float amplitude;
    attribute float rotationDirection; // NOWE!
    
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
    
        float localTime = time * frequency + offset * 5.0;
    
        // Zniekształcenie w osi X i Y – falowanie
        float curveX = sin(position.y * 8.0 + localTime) * amplitude;
        float curveY = cos(position.y * 10.0 + localTime) * amplitude;
    
        vec3 curved = position;
        curved.x += curveX;
        curved.y += curveY;
    
        // Efekt pulsowania promieni na normalnych
        curved += normal * sin(localTime * 1.5 + angle * 10.0) * amplitude * 1.5;
    
        // Rotacja wokół osi Z (własna oś UV)
        float radius = length(position.xy);
        float a = atan(position.y, position.x);
    
        // Dodanie wachadła + kierunku
        a += sin(localTime) * amplitude * rotationDirection;
    
        curved.x = cos(a) * radius;
        curved.y = sin(a) * radius;
    
        gl_Position = projectionMatrix * modelViewMatrix * vec4(curved, 1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 glowColor;
    uniform float time;
    varying vec2 vUv;

    float rand(float x) {
      return fract(sin(x * 1337.13) * 12345.6789);
    }

    void main() {
      // Przesunięcie środka UV
      vec2 uv = vUv - 0.5;

      // Odległość od środka (promień) i kąt
      float angle = atan(uv.y, uv.x);
      
      float dist = length(uv);

      // Oscylacja promieni
      float rays = pow(sin(angle * 32.0 + time * 1.5), 8.0);

      // Nieregularność dla różnych promieni
      float chaos = 0.7 + 0.3 * sin(angle * 20.0 + time * 0.7);
      angle += sin(time * 0.5 + dist * 10.0) * 0.1;


      // Stopniowe zaniknięcie i pulsacja
      float intensity = smoothstep(0.3, 0.0, dist) * rays * chaos;

      vec3 color = glowColor * intensity;

      gl_FragColor = vec4(color, intensity);
    }
  `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
});