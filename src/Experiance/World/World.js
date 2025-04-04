import Experience from "../Experiance.js";
import Resources from "../Utils/Resources.js";
import * as THREE from 'three';
import Environment from "../Environment.js";
import MagicBall from "./ball/MagicBall.js";
import Ring from "./ring/Ring.js";
import {Scroll} from "./scroll/Scroll.js";
import {Deck} from "./cards/Deck.js";

export default class World {

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.resources = this.experiance.resources;
        this.scene = this.experiance.scene;
        this.camera = this.experiance.camera;
        this.angle = 0;

        this.resources.on(Resources.READY_EVENT, () => {
            console.info('Resources ready');

           this.deck = new Deck();

            this.magicBall = new MagicBall();

            this.ring = new Ring();

            this.scroll = new Scroll();

            this.spot = new THREE.SpotLight(0xffe7b0, 50, 5, Math.PI / 3);
            this.spot.position.set(0, 0, 3);
            // this.scene.add(this.spot);
            // this.spotHelper = new THREE.SpotLightHelper(this.spot)
            // this.scene.add(this.spotHelper);

            this.spotBack = new THREE.SpotLight(0xffe7b0, 50, 5, Math.PI / 3);
            // this.spotBack.position.set(0, 0, -3);
            // this.scene.add(this.spotBack);
            // this.spotBackHelper = new THREE.SpotLightHelper(this.spotBack)
            // this.scene.add(this.spotBackHelper);

            this.directional = new THREE.DirectionalLight(0xffffff, 2);
            this.directional.position.set(0, 0, 0);
            // this.scene.add(this.directional);
            // this.directionalHelper = new THREE.DirectionalLightHelper(this.directional);
            // this.scene.add(this.directionalHelper);

            let ambientLight = new THREE.AmbientLight('white', 5);
            this.scene.add(ambientLight);


            this.environment = new Environment();
        })
    }

    update() {
        this.magicBall?.update();
        this.ring?.update();
        this.scroll?.update();
        this.deck?.update();
        // this.angle += 0.05;
        // const radius = 4;
        // if (this.directional) {
        //     this.directional.position.x = Math.sin(this.angle) * radius;
        //     this.directional.position.z = Math.cos(this.angle) * radius;
        //     this.directional.lookAt(0, 0, 0)
        // }
    }
}
