import EventEmitter from "../../Utils/EventEmmiter.js";
import * as THREE from "three";
import Experience from "../../Experiance.js";
import GlowEffect from "../../Utils/GlowEffect.js";
import ScrollRunes from "../scroll/ScrollRunes.js";
import ScrollStars from "../scroll/ScrollStars.js";
import {gsap} from "gsap";
import {Gate} from "../gate/Gate.js";
import createInteriorGlowMaterial from "../../Utils/createInteriorGlowMaterial.js";

export class InteriorGlow extends EventEmitter {
    static InteriorGlowShowStart = 'InteriorGlowShowStart'
    static InteriorGlowHideStart = 'InteriorGlowHideStart'
    fullScale = {x: 5, y: 5, z: 0.2}


    group = new THREE.Group();

    constructor() {
        super();
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.world = this.experiance.world;
        this.mouse = this.experiance.mouse;
        this.raycaster = this.experiance.raycaster;
        this.setMaterial();
        this.setMesh();
        this.watchClick();
    }

    setMaterial() {
        this.glowMaterial = createInteriorGlowMaterial();
    }

    setMesh() {
        this.glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), this.glowMaterial);
        this.glowMesh.position.x = 0;
        this.glowMesh.position.y = 0.2;
        this.glowMesh.position.z = -1.12;
        this.group.add(this.glowMesh);

        this.glowEffect = new GlowEffect(this.glowMaterial, {
            max: 0.5,
            min: 0.00001,
            easeIn: "power3.out",
            easeOut: "power3.out"
        });

        this.runes = new ScrollRunes(this);
        this.stars = new ScrollStars(this);

        this.group.visible = false;
        this.scene.add(this.group);

        const noiseMap = this.resources.items.noiseTexture;
        noiseMap.wrapS = THREE.RepeatWrapping;
        noiseMap.wrapT = THREE.RepeatWrapping;
    }

    update() {
        this.runes?.update();
        this.stars?.update();
    }

    watchClick() {
        this.world.gate.on(Gate.GateOpenStart, () => this.show());
    }

    hide() {
        this.trigger(InteriorGlow.InteriorGlowHideStart);
        this.glowEffect?.fadeOutFor(1, 0);
        gsap.to(this.group.scale, {x: 0, y: 0, z: 0, delay: 1, duration: 0.5, ease: 'power1.inOut'});
        gsap.to(this.stars.material, {opacity: 0, duration: 1, ease: 'power1.inOut'});
        this.runes.materials
            .forEach(material => gsap.to(material, {opacity: 0, duration: 1, ease: 'power1.inOut'}));
    }

    show() {
        this.trigger(InteriorGlow.InteriorGlowShowStart);
        this.group.visible = true;
        this.glowEffect?.fadeIn(1, 0.5, () => {
            this.hide();
        });
        gsap.to(this.stars.material, {opacity: 0.7, duration: 2, ease: 'power1.inOut'});
        gsap.to(this.group.scale, {...this.fullScale, duration: 0.5, ease: 'power1.inOut'});
        this.runes.materials
            .forEach(material => gsap.to(material, {opacity: 0.8, duration: 2, ease: 'power1.inOut'}));
    }
}