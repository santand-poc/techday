import Experience from "../Experiance.js";
import Resources from "../Utils/Resources.js";
import * as THREE from 'three';
import Environment from "../Environment.js";
import MagicBall from "./ball/MagicBall.js";
import Ring from "./ring/Ring.js";
import {Scroll} from "./scroll/Scroll.js";
import {Deck} from "./cards/Deck.js";
import {Frame} from "./belts/Frame.js";
import {Gate} from "./gate/Gate.js";
import {InteriorGlow} from "./interior/InteriorGlow.js";

export default class World {

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.resources = this.experiance.resources;
        this.scene = this.experiance.scene;
        this.camera = this.experiance.camera;
        this.angle = 0;

        this.resources.on(Resources.READY_EVENT, () => {
            console.info('Resources ready');

            this.gate = new Gate();

            this.deck = new Deck();

            this.magicBall = new MagicBall();

            this.ring = new Ring();

            this.scroll = new Scroll();

            this.interiorGlow = new InteriorGlow();

            this.frame = new Frame();

            // this.spot = new THREE.SpotLight(0xffe7b0, 50, 5, Math.PI / 3);
            // this.spot.position.set(0, 0, 3);
            // this.scene.add(this.spot);
            // this.spotHelper = new THREE.SpotLightHelper(this.spot)
            // this.scene.add(this.spotHelper);
            //
            // this.spotBack = new THREE.SpotLight(0xffe7b0, 50, 5, Math.PI / 3);
            // this.spotBack.position.set(0, 0, -3);
            // this.scene.add(this.spotBack);
            // this.spotBackHelper = new THREE.SpotLightHelper(this.spotBack)
            // this.scene.add(this.spotBackHelper);

            // const pointLight = new THREE.PointLight(0xfff8d0, 1.5, 10);
            // pointLight.position.set(0, 1, 2);
            // this.scene.add(pointLight);
            // const pointLightHelper = new THREE.PointLightHelper(pointLight);
            // this.scene.add(pointLightHelper);

            // this.directional = new THREE.DirectionalLight(0xffffff, 0.5);
            // this.directional.position.set(2, 2, 5);
            // this.directional.target.position.set(0, 0, 0);
            // this.scene.add(this.directional);
            // this.directionalHelper = new THREE.DirectionalLightHelper(this.directional);
            // this.scene.add(this.directionalHelper);
            //
            // this.directional2 = new THREE.DirectionalLight(0xffffff, 0.5);
            // this.directional2.position.set(-2, 1.5, 0); // bardziej z przodu
            // this.directional2.target.position.set(-2, 1.5, -1);            this.scene.add(this.directional2);
            // this.directionalHelper2 = new THREE.DirectionalLightHelper(this.directional2);
            // this.scene.add(this.directionalHelper2);
            //
            // this.fillLight = new THREE.PointLight(0xfff2cc, 1.5, 5); // color, intensity, distance
            // this.fillLight.position.set(0, 0.5, 1); // blisko drzwi/tekstu
            // this.scene.add(this.fillLight);

            // this.spotlight = new THREE.SpotLight(0xfff1d0, 20.0, 15, Math.PI / 9, 0.3);
            // this.spotlight.position.set(1.5, 2, 2); // z góry z prawej
            // this.spotlight.target.position.set(0, 0, -2); // patrzy na drzwi / tekst
            // this.scene.add(this.spotlight);
            //
            // this.spotHelper = new THREE.SpotLightHelper(this.spotlight)
            // this.scene.add(this.spotHelper);

            // const spotlight = new THREE.SpotLight(0xfff3cc, 20, 40, Math.PI / 8, 0.3);
            // spotlight.position.set(1.5, 1.5, 3);             // z prawej góry
            // spotlight.target.position.set(0, 0, -2);         // środek sceny (np. drzwi/tekst)
            // spotlight.castShadow = true;
            // this.scene.add(spotlight);
            // this.scene.add(spotlight.target);
            //
            // // === Fill PointLight – wypełnienie od frontu ===
            // const fillLight = new THREE.PointLight(0xffeedd, 10, 40);
            // fillLight.position.set(0, 0.5, 1.5);             // lekko przed tekstem
            // this.scene.add(fillLight);

            let ambientLight = new THREE.AmbientLight('white', 4);
            this.scene.add(ambientLight);


            this.environment = new Environment();
        })
    }

    update() {
        this.magicBall?.update();
        this.ring?.update();
        this.scroll?.update();
        this.deck?.update();
        this.frame?.update();
        this.gate?.update();
        this.interiorGlow?.update();
    }
}
