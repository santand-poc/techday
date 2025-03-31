import * as THREE from 'three';
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Resources from "./Utils/Resources.js";
import sources from './sources.js'
import Raycaster from "./Utils/Raycaster.js";
import Mouse from "./Utils/Mouse.js";

let instance = null;

export default class Experience {
    static get INSTANCE() {
        return new Experience()
    }

    constructor() {
        if (instance) {
            return instance
        }

        instance = this;

        window.experience = this;
        this.webglCanvas = document.getElementById('webgl')
        this.resources = new Resources(sources);
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.mouse = new Mouse();
        this.raycaster = new Raycaster();
        this.renderer = new Renderer();
        this.world = new World();

        this.sizes.on(Sizes.RESIZE_EVENT, this.resize.bind(this))
        this.time.on(Time.TICK_EVENT, this.update.bind(this))
    }

    resize() {
        this.camera?.resize();
        this.renderer?.resize();
    }

    update() {
        this.scene.updateMatrixWorld();
        this.camera?.update();
        this.renderer?.update();
        this.raycaster?.update();
        this.world?.update();
    }
}