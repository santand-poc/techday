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
            map: this.resources.items.explodeScrollContent,
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
        this.contentMesh.position.z = 0.2;
        this.group.add(this.contentMesh);

        this.glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.9), this.glowMaterial);
        this.glowMesh.position.x = 0;
        this.glowMesh.position.y = 0.2;
        this.glowMesh.position.z = -0.12;
        this.group.add(this.glowMesh);

        this.glowMeshCover = new THREE.Mesh(new THREE.PlaneGeometry(2.64, 1.9), new THREE.MeshStandardMaterial({
            map: this.resources.items.fadeTexture,
            transparent: true
        }));
        this.glowMeshCover.position.x = 0;
        this.glowMeshCover.position.y = 0.2;
        this.glowMeshCover.position.z = 1;
        // this.group.add(this.glowMeshCover);

        this.glowEffect = new GlowEffect(this.glowMaterial, {
            max: 1.0,
            min: 0.0,
            duration: 5
        });

        this.runes = new ScrollRunes(this);
        this.stars = new ScrollStars(this);

        this.group.visible = false;
        this.scene.add(this.group);

        this.dissolveEffect = new DissolveEffect(
            [this.mesh, this.contentMesh],
            this.resources.items.noiseTexture,
            3
        );
    }

    update() {
        this.runes?.update();
        this.stars?.update();
    }

    watchRing() {
        this.world.ring.on('hit', () => {
            console.log('on ring hit');
            this.show();
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
        this.dissolveEffect?.start(() => {
            this.group.visible = false;
        });

        this.glowEffect?.fadeOut();
        [this.runes.group.scale, this.group.scale]
            .forEach(scale => gsap.to(scale, {x: 0, y: 0, z: 0, delay: 2, duration: 0.3, ease: 'power3.inOut'}))
    }

    show() {
        this.group.visible = true;
        this.dissolveEffect?.restore();
        this.glowEffect?.fadeIn();

        gsap.to(this.runes.group.scale, {x: 1, y: 1, z: 1, delay: 0.5, duration: 0.1, ease: 'power3.inOut'});
        gsap.to(this.group.scale, {...this.fullScale, duration: 3, ease: 'back.out(2.5)'});
    }
}