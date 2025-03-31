import Experience from "../../Experiance.js";
import * as THREE from "three";

// Glow ShaderMaterial with noise (Three.js custom shader)
const magicUniforms = {
    time: {value: 0},
    glowColor: {value: new THREE.Color(0xffcc66)},
    distortionStrength: {value: 1}
};

const glowMaterial = new THREE.ShaderMaterial({
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

export default class MagicBall {
    constructor(config) {
        this.config = config;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.time = this.experiance.time;
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new THREE.SphereGeometry(10, 64, 64); // średnica 1 jednostka
    }

    setMaterial() {
        this.material = new THREE.MeshPhysicalMaterial({
            transmission: 1.0,
            roughness: 0.2,
            metalness: 0.2,
            reflectivity: 1,
            envMapIntensity: 20,
            clearcoat: 1,
            clearcoatRoughness: 1,
            transparent: true,
            opacity: 1
        });

        this.glowMaterial = glowMaterial;
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, -20, -65);
        this.scene.add(this.mesh);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.createFlares();
    }

    createFlares() {
        this.flareGroup = new THREE.Group();
        this.scene.add(this.flareGroup);

        const flareCount = 20;
        const planeSize = 40;

        for (let i = 0; i < flareCount; i++) {
            const geometry = new THREE.CircleGeometry(planeSize, planeSize);

            const vertexCount = geometry.attributes.position.count;

            const frequencies = new Float32Array(vertexCount);
            const amplitudes = new Float32Array(vertexCount);
            const directions = new Float32Array(vertexCount);

            const freq = 0.5 + Math.random();
            const amp = 0.05 + Math.random() * 0.7;
            const direction = Math.random() > 0.5 ? 1.0 : -1.0;

            for (let j = 0; j < vertexCount; j++) {
                frequencies[j] = freq;
                amplitudes[j] = amp;
                directions[j] = direction;
            }

            geometry.setAttribute('frequency', new THREE.BufferAttribute(frequencies, 1));
            geometry.setAttribute('amplitude', new THREE.BufferAttribute(amplitudes, 1));
            geometry.setAttribute('rotationDirection', new THREE.BufferAttribute(directions, 1));

            const flare = new THREE.Mesh(geometry, this.glowMaterial);

            flare.rotation.x = Math.random() * Math.PI;
            flare.rotation.y = Math.random() * Math.PI;
            flare.rotation.z = Math.random() * Math.PI;

            this.flareGroup.add(flare);
        }

        this.flareGroup.position.copy(this.mesh.position);
    }


    update() {
        const t = performance.now() * 0.001;

        if (this.flareGroup) {
            this.flareGroup.rotation.y = t * 0.2;
            this.flareGroup.rotation.x = t * 0.05;
        }

        if (this.glowMaterial?.uniforms?.time) {
            this.glowMaterial.uniforms.time.value = performance.now() * 0.001;
        }
    }
}