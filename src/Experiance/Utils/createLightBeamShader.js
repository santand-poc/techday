import * as THREE from "three";

export default function createLightBeamShader() {
    return new THREE.ShaderMaterial({
        uniforms: {
            u_time: { value: 0 },
            u_color: { value: new THREE.Color("#965507") }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
           uniform float u_time;
           uniform vec3 u_color;
           varying vec2 vUv;
            
           void main() {
               // Odległość od środka poziomo
               float center = abs(vUv.x - 0.5);
               float beam = 1.0 - smoothstep(0.0, 0.1, center); // szerszy beam
            
               // Fade góra–dół
               float verticalFade = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
               beam *= verticalFade;
            
               // Wyraźniejsze pulsowanie
               float pulse = 1.2 + 0.8 * sin(u_time * 5.0); // mocniejsze i szybsze
               beam *= pulse;
            
               // Finalny kolor z lekkim boostem jasności
               gl_FragColor = vec4(u_color * beam * 1.3, beam);
           }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
}
