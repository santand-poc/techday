import EventEmitter from "./EventEmmiter.js";
import * as THREE from "three";
import Experience from "../Experiance.js";

export default class Raycaster extends EventEmitter {
    constructor() {
        super();
        this.experience = Experience.INSTANCE;
        this.camera = this.experience.camera;
        this.mouse = this.experience.mouse;
        this.instance = new THREE.Raycaster();
        this.intersections = [];
    }

    update() {
        this.instance.setFromCamera(this.mouse?.instance, this.camera.instance)
        const objects = [];
        this.experience.world?.deck?.cards?.forEach(card => objects.push(card.intersectMesh));
        if (this.experience.world?.scroll?.mesh) {
            objects.push(this.experience.world.scroll.mesh);
        }
        this.intersections = this.instance.intersectObjects(objects);
    }

}