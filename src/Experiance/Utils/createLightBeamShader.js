import * as THREE from "three";

export default function createLightBeamShader() {
    return new THREE.ShaderMaterial({
        uniforms: {
            u_time: { value: 0 },
            u_color: { value: new THREE.Color("#f18f01") } // bursztynowy magiczny żar
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

            float hash(vec2 p) {
                return fract(sin(dot(p ,vec2(127.1,311.7))) * 43758.5453);
            }

            float noise(vec2 p){
                vec2 i = floor(p);
                vec2 f = fract(p);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                vec2 u = f*f*(3.0-2.0*f);
                return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
                float center = abs(vUv.x - 0.5);
                float beam = 1.0 - smoothstep(0.0, 0.1, center);

                float verticalFade = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);

                float flicker = 1.0 
                    + 0.25 * sin(u_time * 1.2 + vUv.y * 3.0)
                    + 0.15 * sin(u_time * 2.5 + vUv.y * 4.0)
                    + 0.1 * noise(vec2(vUv.y * 8.0, u_time * 0.5));

                float breath = 0.9 + 0.2 * sin(u_time * 0.6);
                float shimmer = 0.97 + 0.05 * noise(vUv * 25.0 + u_time * 1.5);

                beam *= verticalFade;
                beam *= flicker * breath * shimmer;

                gl_FragColor = vec4(u_color * beam * 1.2, beam);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
}
