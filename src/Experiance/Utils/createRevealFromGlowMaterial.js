import * as THREE from "three";

export default function createRevealFromGlowMaterial(originalMap, noiseMap) {
    return new THREE.ShaderMaterial({
        uniforms: {
            originalMap: { value: originalMap },
            noiseMap: { value: noiseMap },
            threshold: { value: 1.0 },
            glowColor: { value: new THREE.Color(1.0, 0.2, 0.0) },
            time: { value: 0 }
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
            uniform vec3 glowColor;
            
            varying vec2 vUvBase;
            varying vec2 vUvNoise;
            
            void main() {
                vec4 base = texture2D(originalMap, vUvBase);
            
                // Jeśli animacja się zakończyła – pokaż czysty zwój
                if (threshold <= 0.0001) {
                    gl_FragColor = base;
                    return;
                }
            
                float fire = texture2D(noiseMap, vUvNoise).r;
                float burn = smoothstep(threshold - 0.2, threshold + 0.1, fire);
            
                vec3 flameColor = mix(glowColor, base.rgb, burn);
                float alpha = mix(0.0, base.a, burn);
            
                gl_FragColor = vec4(flameColor, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        toneMapped: false
    });
}
