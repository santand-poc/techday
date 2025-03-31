import Experience from "../../Experiance.js";
import * as THREE from 'three';

export default class PlaneLabel {
    constructor(config) {
        this.config = config;
        this.experiance = Experience.INSTANCE;
        this.resources = this.experiance.resources;
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(0.7, 0.1);
    }

    setMaterial() {
        const textTexture = this.config.texture;
        this.material = new THREE.MeshBasicMaterial({
            map: this.resources.items[textTexture],
            normalMap: this.resources.items[textTexture],
            roughnessMap: this.resources.items[textTexture],
            metalnessMap: this.resources.items[textTexture],
            transparent: true,
            roughness: 0.1,
            side: THREE.FrontSide,
            normalScale: new THREE.Vector2(2, 2)
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
    }

    update() {
        this.mesh?.quaternion.copy(Experience.INSTANCE.camera.instance.quaternion);
    }
}