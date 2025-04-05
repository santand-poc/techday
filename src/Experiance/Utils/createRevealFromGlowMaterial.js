import * as THREE from "three";

export default function createRevealFromGlowMaterial(originalMap, noiseMap) {
    return new THREE.ShaderMaterial({
        uniforms: {
            originalMap: { value: originalMap },
            noiseMap: { value: noiseMap },
            threshold: { value: 1.0 }, // animujesz do 0
            glowColor: { value: new THREE.Color(1.0, 0.4, 0.0) }, // ogień
            time: { value: 0 },
            softness: { value: 0.3 }
        },
        vertexShader: `
            varying vec2 vUvBase;
            varying vec2 vUvNoise;
            uniform float time;

            void main() {
                vUvBase = uv;
                vUvNoise = uv + vec2(time * 0.1, time * -0.05);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D originalMap;
            uniform sampler2D noiseMap;
            uniform float threshold;
            uniform float softness;
            uniform vec3 glowColor;

            varying vec2 vUvBase;
            varying vec2 vUvNoise;

            void main() {
                vec4 base = texture2D(originalMap, vUvBase);

                // Odległość od środka (zewnątrz do środka)
                vec2 center = vec2(0.5, 0.5);
                float dist = 1.0 - distance(vUvBase, center);
                float noise = texture2D(noiseMap, vUvNoise).r;
                float burnFactor = dist + noise * 0.15;

                // ❌ Znikanie: wcześniej niż render
                // if (burnFactor < threshold - softness) discard;

                
                float burn = smoothstep(threshold - softness, threshold, burnFactor);
                
                // Pierścień ognia
                float edge = smoothstep(threshold - 0.05, threshold + 0.05, burnFactor) -
                             smoothstep(threshold - 0.01, threshold + 0.01, burnFactor);
                
                vec3 edgeColor = mix(glowColor, vec3(1.0, 0.6, 0.3), 0.3);
                vec3 flameColor = mix(glowColor, base.rgb, burn);
                flameColor += edgeColor * edge * 0.8;

                float alpha = base.a * burn;
                if (threshold > 0.9999) discard;
                
                gl_FragColor = vec4(flameColor, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        toneMapped: false
    });
}
