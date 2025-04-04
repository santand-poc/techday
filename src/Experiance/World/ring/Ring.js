import Experience from "../../Experiance.js";
import * as THREE from "three";
import createRingSlots from "./Slot.js";
import {rotateRingStep} from "../../Utils/Events.js";
import EventEmitter from "../../Utils/EventEmmiter.js";

export default class Ring extends EventEmitter {
    targetRotation = 0;
    group = new THREE.Group();

    constructor(config) {
        super();
        this.config = config;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.time = this.experiance.time;
        this.world = this.experiance.world;
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.watchClick();
    }

    setGeometry() {
        this.geometry = new THREE.RingGeometry(5, 85, 64, 1);
        this.innerGeometry = new THREE.RingGeometry(5, 85, 64, 1);
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.resources.items.ringTexture,
            normalMap: this.resources.items.ringTextureNormal,
            roughnessMap: this.resources.items.ringTextureRoughness,
            roughness: 1,
            metalness: 0,
            envMapIntensity: 0.0
        });
        this.innerMaterial = new THREE.MeshStandardMaterial({
            map: this.resources.items.ringTexture,
            normalMap: this.resources.items.ringTextureNormal,
            roughnessMap: this.resources.items.ringTextureRoughness,
            alphaMap: this.resources.items.ringTextureAlpha,
            alphaTest: 0.5,
            roughness: 1,
            metalness: 0,
            envMapIntensity: 0.0
        });
        this.innerSecondMaterial = new THREE.MeshStandardMaterial({
            map: this.resources.items.ringTexture,
            normalMap: this.resources.items.ringTextureNormal,
            roughnessMap: this.resources.items.ringTextureRoughness,
            alphaMap: this.resources.items.ringSecondTextureAlpha,
            alphaTest: 0.5,
            roughness: 1,
            metalness: 0,
            envMapIntensity: 0.0
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.group.add(this.mesh);

        this.innerMesh = new THREE.Mesh(this.innerGeometry, this.innerMaterial);
        this.innerMesh.position.z += 0.1;
        this.group.add(this.innerMesh);

        this.innerSecondMesh = new THREE.Mesh(this.innerGeometry, this.innerSecondMaterial);
        this.innerSecondMesh.position.z += 0.15;
        this.group.add(this.innerSecondMesh);

        this.slots = createRingSlots(63.5, 12, this);
        this.slots.forEach(slot => this.group.add(slot));

        this.group.position.z = -65;
        this.scene.add(this.group);
    }

    watchClick() {
        this.world.deck.cards.forEach(card => {
            card.on('hit', () => {
                rotateRingStep(this.innerMesh, 1, () => {
                    console.log('card hit', card.config);
                    this.trigger('hit');
                });
                rotateRingStep(this.innerSecondMesh, -1);
            })
        })
    }

    update() {

    }
}