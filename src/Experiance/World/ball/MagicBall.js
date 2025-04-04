import Experience from "../../Experiance.js";
import * as THREE from "three";
import ballGlow from "./ballGlow.js";

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

        this.glowMaterial = ballGlow;
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, -65);
        this.scene.add(this.mesh);

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