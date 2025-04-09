import * as THREE from "three";

export default function createInteriorGlowMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color('brown') },
            glowStrength: { value: 1.0 },
            time: { value: 0.0 }
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

            float hash(vec2 p) {
              return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }

            float noise(vec2 p) {
              vec2 i = floor(p);
              vec2 f = fract(p);
              float a = hash(i);
              float b = hash(i + vec2(1.0, 0.0));
              float c = hash(i + vec2(0.0, 1.0));
              float d = hash(i + vec2(1.0, 1.0));
              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(a, b, u.x) +
                     (c - a) * u.y * (1.0 - u.x) +
                     (d - b) * u.x * u.y;
            }

            void main() {
                vec2 uv = vUv;
                vec2 distToEdge = min(uv, 1.0 - uv);
                float border = 0.08;
                float radius = 0.2;

                float softness = smoothstep(0.0, radius, min(distToEdge.x, distToEdge.y));
                float glow = smoothstep(1.0, 1.0 - border, max(distToEdge.x, distToEdge.y));

                // Dodajemy pulsację – nieregularny oddech
                float flicker = 0.2
                    + 0.15 * sin(time * 1.5 + uv.y * 4.0)
                    + 0.05 * noise(uv * 10.0 + time * 0.5);

                float finalGlow = glow * softness * flicker;

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
