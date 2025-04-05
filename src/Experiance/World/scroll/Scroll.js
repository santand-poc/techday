import * as THREE from "three";
import Experience from "../../Experiance.js";
import Mouse from "../../Utils/Mouse.js";
import ScrollRunes from './ScrollRunes.js';
import ScrollStars from "./ScrollStars.js";
import {gsap} from "gsap";
import createGlowMaterial from "../../Utils/glowMaterial.js";
import DissolveEffect from '../../Utils/DissolveEffect.js';
import GlowEffect from "../../Utils/GlowEffect.js";

export class Scroll {
    fullScale = {x: 5, y: 5, z: 0.2}


    group = new THREE.Group();

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.world = this.experiance.world;
        this.mouse = this.experiance.mouse;
        this.raycaster = this.experiance.raycaster;
        this.setMaterial();
        this.setMesh();
        this.watchRing();
        this.watchClick();
    }

    setMaterial() {
        this.meshMaterial = new THREE.MeshStandardMaterial({
            map: this.resources.items.scrollTexture
        });
        this.contentMaterial = new THREE.MeshBasicMaterial({
            map: this.resources.items.explodeScrollContent,
            wireframe: true,
            color: 'green'
        });
        this.glowMaterial = createGlowMaterial();
    }

    setMesh() {
        this.meshGeometry = new THREE.PlaneGeometry(4, 2.2);
        this.mesh = new THREE.Mesh(this.meshGeometry, this.meshMaterial)
        this.mesh.position.z = -0.2;
        this.mesh.position.y = 0.2;
        this.group.add(this.mesh);

        this.contentGeometry = new THREE.PlaneGeometry(2.4, 1.9);
        this.contentMesh = new THREE.Mesh(this.contentGeometry, this.contentMaterial);
        this.contentMesh.position.x = -0.1;
        this.contentMesh.position.y = 0.2;
        this.contentMesh.position.z = -0.1;
        this.group.add(this.contentMesh);

        this.glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), this.glowMaterial);
        this.glowMesh.position.x = 0;
        this.glowMesh.position.y = 0.2;
        this.glowMesh.position.z = -1.12;
        this.group.add(this.glowMesh);

        this.glowEffect = new GlowEffect(this.glowMaterial, {
            max: 0.4,
            min: 0.0
        });

        this.runes = new ScrollRunes(this);
        this.stars = new ScrollStars(this);

        this.group.visible = false;
        this.scene.add(this.group);

        this.dissolveEffect = new DissolveEffect(
            [this.mesh, this.contentMesh],
            this.resources.items.noiseTexture
        );
    }

    update() {
        this.runes?.update();
        this.stars?.update();
    }

    watchRing() {
        this.world.ring.on('hit', () => {
            console.log('on ring hit');
            this.show(this.world.ring.lastHit);
        })
    }

    watchClick() {
        this.mouse.on(Mouse.LEFT_ClICK_EVENT, () => {
            if (!this.isHovered() && this.group.visible === true) {
                this.hide()
            }
        });
    }

    isHovered() {
        function isChildOf(obj, uuid) {
            if (!obj) return false;
            if (obj.uuid === uuid) return true;
            return isChildOf(obj?.parent, uuid);
        }

        return isChildOf(this.raycaster?.intersections?.[0]?.object, this.mesh.uuid);
    }

    hide() {
        this.dissolveEffect?.burn(3,() => this.group.visible = false);
        this.glowEffect?.fadeOutFor(2);
        gsap.to(this.stars.material, {opacity: 0, duration: 2, ease: 'power3.inOut'});
        gsap.to(this.group.scale, {x: 0, y: 0, z: 0, delay: 2, duration: 0.1, ease: 'power3.inOut'});
        this.runes.materials
            .forEach(material => gsap.to(material, {opacity: 0, delay: 0.5, duration: 2, ease: 'power3.inOut'}));
    }

    show(cardConfig) {
        console.log(cardConfig);
        this.group.visible = true;
        this.dissolveEffect?.create(3);
        this.glowEffect?.fadeIn(3);
        gsap.to(this.stars.material, {opacity: 0.7, duration: 2, ease: 'power3.inOut'});
        gsap.to(this.group.scale, {...this.fullScale, duration: 2, ease: 'back.out(2.5)'});
        this.runes.materials
            .forEach(material => gsap.to(material, {opacity: 0.8, duration: 2, ease: 'power3.inOut'}));
    }
}