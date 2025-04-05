import * as THREE from 'three';

export default function createRimGlowMaterial(color = 0xffcc66, strength = 1.0, width = 2.0) {
    return new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(color) },
            viewVector: { value: new THREE.Vector3(0, 0, 1) }, // zaktualizujemy w update()
            strength: { value: strength },
            width: { value: width }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vWorldPosition;

            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            uniform vec3 viewVector;
            uniform float strength;
            uniform float width;

            varying vec3 vNormal;
            varying vec3 vWorldPosition;

            void main() {
                float intensity = pow(width - dot(normalize(vNormal), normalize(viewVector)), strength);
                gl_FragColor = vec4(glowColor, intensity);
            }
        `,
        side: THREE.BackSide, // obrys
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });
}
