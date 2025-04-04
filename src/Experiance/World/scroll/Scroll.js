import * as THREE from "three";
import Experience from "../../Experiance.js";
import Mouse from "../../Utils/Mouse.js";
import ScrollParticles from './ScrollParticles.js';
import ScrollStars from "./ScrollStars.js";
import {gsap} from "gsap";
import createGlowMaterial from "../../Utils/glowMaterial.js";

export class Scroll {
    hiddenScale = {x: 0, y: 0, z: 0}
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
            map: this.resources.items.explodeScrollContent,
            transparent: true
        });
        this.glowMaterial = createGlowMaterial();
    }

    setMesh() {
        this.mesh = this.resources.items.simpleScroll.scene.children[0];
        this.mesh.rotation.x = -Math.PI;
        this.mesh.rotation.y = Math.PI;
        this.mesh.rotation.z = Math.PI / 2;
        this.mesh.position.x = -1.5;
        this.mesh.position.y = 0.2;
        this.group.add(this.mesh);

        this.contentGeometry = new THREE.PlaneGeometry(2.4, 1.9);
        this.contentMesh = new THREE.Mesh(this.contentGeometry, this.contentMaterial);
        this.contentMesh.position.x = -0.1;
        this.contentMesh.position.y = 0.2;
        this.contentMesh.position.z = 0.01;
        this.group.add(this.contentMesh);

        this.glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.9), this.glowMaterial);
        this.glowMesh.position.x = 0;
        this.glowMesh.position.y = 0.2;
        this.glowMesh.position.z = -0.1;
        this.group.add(this.glowMesh);

        this.particles = new ScrollParticles(this);
        this.stars = new ScrollStars(this);

        this.group.visible = false;
        this.scene.add(this.group);
    }

    update() {
        this.particles?.update();
        this.stars?.update();
        this.glowMesh.material.uniforms.glowStrength.value = 1.5;
    }

    watchRing() {
        this.world.ring.on('hit', () => {
            console.log('on ring hit');
            this.show();
        })
    }

    watchClick() {
        this.mouse.on(Mouse.LEFT_ClICK_EVENT, () => {
            if (!this.isHovered()) {
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
        const onComplete = () => this.group.visible = false;
        gsap.to(this.group.scale, {...this.hiddenScale, duration: 1, ease: 'power3.inOut', onComplete});
    }

    show() {
        this.group.visible = true;
        gsap.to(this.group.scale, {...this.fullScale, duration: 1, ease: 'back.out(2.5)'});
    }
}