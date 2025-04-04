import * as THREE from 'three';
import Experience from "./Experiance.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {

    constructor() {
        this.experience = Experience.INSTANCE;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.webglCanvas = this.experience.webglCanvas;
        this.setInstance();
        this.setOrbitControls();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 10000);
        this.instance.position.set(0, 0, 5);
        // this.instance.position.set(-9, 0, 5);
        this.instance.zoom = 0.25;
        this.scene.add(this.instance)
    }


    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.webglCanvas);
        this.controls.enableRotate = false;
        this.controls.enablePan = false;
    }

    resize() {
        this.instance?.updateProjectionMatrix();
    }


    update() {
        this.instance?.updateProjectionMatrix();
        this.controls?.update();
    }


    shake(intensity = 0.1, duration = 0.3) {
        const initialPos = this.instance.position.clone();
        const times = 10;
        let i = 0;

        function doShake(camera) {
            if (i < times) {
                const offsetX = (Math.random() - 0.5) * intensity;
                const offsetY = (Math.random() - 0.5) * intensity;
                const offsetZ = (Math.random() - 0.5) * intensity * 0.2;

                camera.instance.position.set(
                    initialPos.x + offsetX,
                    initialPos.y + offsetY,
                    initialPos.z + offsetZ
                );

                i++;
                setTimeout(() => doShake(camera), duration * 1000 / times);
            } else {
                camera.instance.position.copy(initialPos);
            }
        }

        doShake(this);
    }

}