import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import gsap from 'gsap';
import Experience from "../../Experiance.js";
import EventEmitter from "../../Utils/EventEmmiter.js";
import createLightBeamShader from "../../Utils/createLightBeamShader.js";
import Mouse from "../../Utils/Mouse.js";

export class Gate extends EventEmitter {
    static GateOpenStart = 'GateOpenStart'
    static GateCloseStart = 'GateCloseStart'

    constructor(config) {
        super();
        this.config = config;
        this.experience = Experience.INSTANCE;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;
        this.world = this.experience.world;
        this.raycaster = this.experience.raycaster;
        this.mouse = this.experience.mouse;

        this.isOpen = false;

        this.setGeometry();
        this.setMaterial();
        this.setMeshes();
        this.addResizeListener();
        this.setInteraction();
    }

    setGeometry() {
        // Połowa szerokości drzwi
        this.doorWidth = 0.5;
        this.geometry = new RoundedBoxGeometry(this.doorWidth, 1.03, 0.01, 2, 0.05);
    }

    setMaterial() {
        this.leftMaterial = new THREE.MeshStandardMaterial({
            map: this.resources.items.gateLeft,
            normalMap: this.resources.items.gateLeftDisplacement,
            roughnessMap: this.resources.items.gateLeftRoughness,
            metalnessMap: this.resources.items.gateLeftDisplacement,
            envMapIntensity: 15,
            roughness: 1,
            metalness: 1
        });
        this.rightMaterial = new THREE.MeshStandardMaterial({
            map: this.resources.items.gateRight,
            normalMap: this.resources.items.gateRightDisplacement,
            roughnessMap: this.resources.items.gateRightRoughness,
            metalnessMap: this.resources.items.gateRightDisplacement,
            envMapIntensity: 15,
            roughness: 1,
            metalness: 1
        });

        this.lightBeamMaterial = createLightBeamShader();
    }

    setMeshes() {
        // Lewa strona
        this.leftDoor = new THREE.Mesh(this.geometry, this.leftMaterial);
        this.leftDoorGroup = new THREE.Group();
        this.leftDoorGroup.add(this.leftDoor);

        this.rightDoor = new THREE.Mesh(this.geometry, this.rightMaterial);
        this.rightDoorGroup =  new THREE.Group();
        this.rightDoorGroup.add(this.rightDoor);

        // Pivoty
        this.leftPivot = new THREE.Object3D();
        this.rightPivot = new THREE.Object3D();

        // Ustawiamy pivot na lewej krawędzi lewego skrzydła
        this.leftDoorGroup.position.set(this.doorWidth / 2, 0, 0); // bo pivot będzie na krawędzi
        this.leftPivot.add(this.leftDoorGroup);
        this.leftPivot.position.set(-this.doorWidth, 0, 0); // w lewo od środka

        // Ustawiamy pivot na prawej krawędzi prawego skrzydła
        this.rightDoorGroup.position.set(-this.doorWidth / 2, 0, 0);
        this.rightPivot.add(this.rightDoorGroup);
        this.rightPivot.position.set(this.doorWidth, 0, 0); // w prawo od środka

        // Grupa drzwi (dla łatwego przesuwania całości)
        this.doorGroup = new THREE.Group();
        this.doorGroup.add(this.leftPivot);
        this.doorGroup.add(this.rightPivot);
        this.doorGroup.position.set(0, 0, -2); // umieszczamy drzwi przed kamerą

        this.scene.add(this.doorGroup); // lepiej niż do kamery!

        const geometry = new THREE.PlaneGeometry(0.5, 30); // szerokość i wysokość światła
        this.lightMesh = new THREE.Mesh(geometry, this.lightBeamMaterial);
        this.lightMesh.position.set(0, 0, -1.99); // lekko do przodu, między drzwiami
        this.scene.add(this.lightMesh);

        this.resize();
    }

    addResizeListener() {
        this.sizes?.on('resize', () => {
            this.resize();
        });
    }

    resize() {
        const fov = this.camera.instance.fov * (Math.PI / 180);
        const distance = Math.abs(this.doorGroup.position.z - this.camera.instance.position.z);
        const zoom = this.camera.instance.zoom || 1;

        const height = 2 * Math.tan(fov / 2) * distance / zoom;
        const width = height * (this.sizes.width / this.sizes.height);

        this.doorGroup.scale.set(width, height, 1);
    }

    setInteraction() {
        this.mouse.on(Mouse.LEFT_ClICK_EVENT, () => {
            console.log('isHover', this.isHover());
            if (this.isHover()) {
                this.isOpen = !this.isOpen;
                this.toggleDoor();
            }
        });
    }

    isHover() {
        return this.raycaster.intersections?.some((intersection) => {
            let hoverAndyDoor = [];
            this.doorGroup.traverse((door) => hoverAndyDoor.push(door.uuid === intersection.object.uuid));
            return hoverAndyDoor.some(Boolean);
        });
    }

    toggleDoor() {
        if (!this.isOpen) {
            this.closeDoor();
        } else {
            this.openDoor();
        }
    }

    openDoor() {
        this.isOpen = true;
        this.trigger(Gate.GateOpenStart);

        this.lightMesh.visible = false;

        gsap.to(this.leftPivot.rotation, {
            y: Math.PI / 2,
            duration: 1,
            ease: "power1.inOut"
        });

        gsap.to(this.rightPivot.rotation, {
            y: -Math.PI / 2,
            duration: 1,
            ease: "power1.inOut"
        });
    }

    closeDoor() {
        this.isOpen = false;
        this.trigger(Gate.GateCloseStart);

        gsap.to(this.leftPivot.rotation, {
            y: 0,
            duration: 1,
            ease: "power2.in",
            onComplete: () => {
                this.lightMesh.visible = true;
            }
        });

        gsap.to(this.rightPivot.rotation, {
            y: 0,
            duration: 1,
            ease: "power2.in"
        });
    }

    update() {
        if (this.lightBeamMaterial) {
            this.lightBeamMaterial.uniforms.u_time.value = this.time.elapsed * 0.0007; // sekundy
        }
    }
}
