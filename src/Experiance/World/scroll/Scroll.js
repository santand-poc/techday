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
        this.contentMaterial = new THREE.MeshBasicMaterial({
            map: this.resources.items.explodeScrollContent
        });
        this.glowMaterial = createGlowMaterial();
    }

    setMesh() {
        const meshMaterial = new THREE.MeshStandardMaterial({
            map: this.resources.items.scrollTexture,
            needsUpdate: true
        });
        meshMaterial.needsUpdate = true;
        this.meshGeometry = new THREE.PlaneGeometry(4, 2.2);
        this.mesh = new THREE.Mesh(this.meshGeometry, meshMaterial)
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

        const noiseMap = this.resources.items.noiseTexture;
        noiseMap.wrapS = THREE.RepeatWrapping;
        noiseMap.wrapT = THREE.RepeatWrapping;

        this.dissolveEffect = new DissolveEffect(
            [this.mesh, this.contentMesh],
            noiseMap
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
        this.dissolveEffect?.burn(2.5,() => {
            setTimeout(() => this.group.visible = false, 2000)
        });
        gsap.to(this.group.scale, {x: 0, y: 0, z: 0, delay: 5, duration: 0.5, ease: 'power1.inOut'});
        this.glowEffect?.fadeOutFor(3, 2);
        gsap.to(this.stars.material, {opacity: 0, duration: 5, ease: 'power1.inOut'});
        this.runes.materials
            .forEach(material => gsap.to(material, {opacity: 0, duration: 5, ease: 'power1.inOut'}));
    }

    show(cardConfig) {
        this.resetContent(cardConfig);
        this.group.visible = true;
        this.dissolveEffect?.create(3);
        this.glowEffect?.fadeIn(1, 1.5);
        gsap.to(this.stars.material, {opacity: 0.7, duration: 2, ease: 'power1.inOut'});
        gsap.to(this.group.scale, {...this.fullScale, duration: 0.5, ease: 'power1.inOut'});
        this.runes.materials
            .forEach(material => gsap.to(material, {opacity: 0.8, duration: 2, ease: 'power1.inOut'}));
    }

    resetContent(cardConfig) {
        if (this.contentMesh.material.uniforms?.originalMap) {
            this.contentMesh.material.uniforms.originalMap.value = this.resources.items[cardConfig.scrollContent];
        } else {
            this.contentMesh.material.map = this.resources.items[cardConfig.scrollContent];
            this.contentMesh.material.needsUpdate = true;
        }
    }
}