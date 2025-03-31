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

        this.controls.enablePan = false;
    }

    resize() {
        this.instance.updateProjectionMatrix();
    }


    update() {
        this.instance.updateProjectionMatrix();
        this.updatePosition();
        this.controls?.update();
    }

    updatePosition() {

    }
}