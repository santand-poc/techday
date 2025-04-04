import Experience from "../../Experiance.js";
import {RoundedBoxGeometry} from "three/addons";
import * as THREE from "three";
import PlaneLabel from "../texts/PlaneLabel.js";
import Mouse from "../../Utils/Mouse.js";
import {animateCardToSlot, animateTo, spawnBlastEffect, spawnSmokeEffect,} from "../../Utils/Events.js";
import EventEmitter from "../../Utils/EventEmmiter.js";
import cardBackMaterial from './cardBackMaterial.js';
import cardFrontMaterial from './cardFrontMaterial.js';
import HoverEffect from "../../Utils/HoverEffect.js";
import createGlowMaterial from "../../Utils/glowMaterial.js";
import GlowEffect from "../../Utils/GlowEffect.js";

export class Card extends EventEmitter {
    defaultPosition = {x: 0, y: 0, z: 0}
    inserted = false;
    centered = false;

    constructor(config) {
        super();
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.raycaster = this.experiance.raycaster;
        this.time = this.experiance.time;
        this.camera = this.experiance.camera;
        this.mouse = this.experiance.mouse;
        this.config = config;
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.watchClicked();
    }

    setGeometry() {
        const topGeometryHeight = this.config.topGeometryFull ? 1.92 : 1.08;
        this.geometry = new RoundedBoxGeometry(1.08, 1.92, 0.04, 2, 0.05);
        this.topPlaneGrometry = new THREE.PlaneGeometry(1.08, topGeometryHeight);
        this.bottomPlaneGrometry = new THREE.PlaneGeometry(1.08, 0.6);
    }

    setMaterial() {
        const topTexture = this.config.topTexture;
        const bottomTexture = this.config.bottomTexture;
        const backMaterial = cardBackMaterial();
        const frontMaterial = cardFrontMaterial(this.config.coverTexture);

        this.materials = {
            right: new THREE.MeshBasicMaterial({color: '#38200e'}),
            left: new THREE.MeshBasicMaterial({color: '#38200e'}),
            top: new THREE.MeshBasicMaterial({color: '#38200e'}),
            bottom: new THREE.MeshBasicMaterial({color: '#38200e'}),
            front: frontMaterial,
            back: backMaterial,
            innerTop: topTexture ? new THREE.MeshStandardMaterial({
                map: this.resources.items[topTexture],
            }) : undefined,
            innerBottom: bottomTexture ? new THREE.MeshStandardMaterial({
                map: this.resources.items[bottomTexture],
            }) : undefined
        }
    }

    setMesh() {
        const topGeometryFull = this.config.topGeometryFull;
        const labelTexture = this.config.labelTexture;
        this.group = new THREE.Group();

        this.mesh = new THREE.Mesh(this.geometry, [
            this.materials.right,
            this.materials.left,
            this.materials.top,
            this.materials.bottom,
            this.materials.front,
            this.materials.back,
        ]);
        this.mesh.name = "CardBase"
        this.group.add(this.mesh);

        if (this.materials.innerTop) {
            this.topPlane = new THREE.Mesh(
                this.topPlaneGrometry,
                this.materials.innerTop
            );
            this.topPlane.position.y = topGeometryFull ? 0 : 0.35;
            this.topPlane.position.z = -0.02;
            this.group.add(this.topPlane);
        }

        if (this.materials.innerBottom) {
            this.bottomPlane = new THREE.Mesh(
                this.bottomPlaneGrometry,
                this.materials.innerBottom
            );
            this.bottomPlane.position.y = -0.6;
            this.group.add(this.bottomPlane);
        }

        if (labelTexture) {
            this.labelText = new PlaneLabel({texture: labelTexture}).mesh;
            this.labelText.position.z = 0.026;
            this.labelText.position.y = -0.26;
            this.group.add(this.labelText);
        }

        this.glowMaterial = createGlowMaterial();
        this.glow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 2.4),
            this.glowMaterial
        );
        this.group.add(this.glow);

        this.camera.instance.add(this.group);

        this.intersectMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.08, 1.92),
            new THREE.MeshBasicMaterial({
                color: 'green',
                opacity: 0,
                transparent: true,
                wireframe: true,
                side: THREE.DoubleSide
            })
        );

        this.camera.instance.add(this.intersectMesh);
    }

    setDefaults(x, y, z) {
        this.defaultPosition.x = x ?? 0;
        this.defaultPosition.y = y ?? 0;
        this.defaultPosition.z = z ?? 0;
        this.resetPosition(this.defaultPosition);
        this.hoverEffect = new HoverEffect([this.group, this.intersectMesh], {
            hoverY: 1,
            duration: 0.4,
            easeIn: "back.out(2)",
            easeOut: "sine.inOut"
        });
        this.glowEffect = new GlowEffect(this.glowMaterial, {
            max: 1.0,
            min: 0.0,
            duration: 0.4
        });
    }

    update() {
        if (this.inserted) {
            return;
        }
        if (this.centered) {
            return;
        }

        if (this.isHovered()) {
            this.setHoverState();
        } else {
            this.setUnHoverState();
        }
    }

    watchClicked() {
        this.mouse.on(Mouse.LEFT_ClICK_EVENT, () => {
            if (this.isHovered()) {
                this.onClicked();
            }
        })
    }

    isHovered() {
        return this.raycaster?.intersections?.[0]?.object.uuid === this.intersectMesh.uuid;
    }

    setHoverState() {
        this.hoverEffect.hoverOn();
        this.glowEffect.fadeIn();
    }

    setUnHoverState() {
        this.hoverEffect.hoverOff();
        this.glowEffect.fadeOut();

        this.group.scale.set(1, 1, 1);
        this.intersectMesh.scale.set(1, 1, 1);
        this.group.rotation.set(0, Math.PI, 0);
        this.intersectMesh.rotation.set(0, 0, 0);
    }

    onClicked() {
        if (this.centered !== true) {
            this.sendToFront();
            return;
        }
        if (this.inserted !== true) {
            this.sendToRing();
            return;
        }

        this.reset();
    }

    sendToFront() {
        this.centered = true;
        animateTo(this.group, {x: 0, y: 1.4, z: -10}, 9, 1, () => {
            this.camera.shake();
        });
        animateTo(this.intersectMesh, {x: 0, y: 1.4, z: -10}, 9);
    }

    sendToRing() {
        const respectiveSlot = this.getRespectiveSlot();
        animateCardToSlot(this.group, respectiveSlot, 1, () => {
            spawnSmokeEffect(this.mesh);
            spawnBlastEffect(this.mesh);
            this.trigger('hit');
            this.inserted = true;
            this.camera.shake(0.05);
        });
        animateCardToSlot(this.intersectMesh, respectiveSlot, 1);
    }

    reset() {
        this.resetPosition(this.defaultPosition);
        this.setUnHoverState();
        this.centered = false;
        this.inserted = false;
    }

    resetPosition({x, y, z}) {
        this.group.position.set(x, y, z);
        this.intersectMesh.position.set(x, y, z);
    }

    getRespectiveSlot() {
        let slot = null
        this.scene.traverse((child) => {
            if (child.userData.name === 'SLOT' && child.userData.index === this.config.index) {
                slot = child;
            }
        });
        return slot;
    }
}