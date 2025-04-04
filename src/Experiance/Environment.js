import Experience from "./Experiance.js";
import * as THREE from 'three';

export default class Environment {

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.experiance.environment = this;

        this.setEnvironmentMap();
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.sceneBackgroundEqui;
        this.environmentMap.texture.mapping = THREE.EquirectangularReflectionMapping;

        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;
        this.scene.environment = this.environmentMap.texture;
        this.scene.background = this.resources.items.sceneBackground;

        this.environmentMap.updateMaterial = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = child.material.envMap  !== undefined ? child.material.envMap : this.environmentMap.texture;
                    child.material.envMapIntensity = child.material.envMapIntensity !== undefined ? child.material.envMapIntensity : this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        }

        this.environmentMap.updateMaterial();
    }
}