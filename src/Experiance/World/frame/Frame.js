import Experience from "../../Experiance.js";
import * as THREE from "three";
import Sizes from "../../Utils/Sizes.js";
import {Scroll} from "../scroll/Scroll.js";
import {gsap} from "gsap";

export class Frame {
    constructor(config) {
        this.config = config;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.time = this.experiance.time;
        this.camera = this.experiance.camera;
        this.sizes = this.experiance.sizes;
        this.world = this.experiance.world;

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.addResizeListener();
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(1, 1); // Bazowa jednostka
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.resources.items.backgroundFrame,
            transparent: true
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, -3); // Umieszczamy 1 jednostkę przed kamerą
        this.camera.instance.add(this.mesh);

        this.resize(); // Pierwsze przeliczenie
    }

    resize() {
        const fov = this.camera.instance.fov * (Math.PI / 180);
        const distance = Math.abs(this.mesh.position.z);
        const zoom = this.camera.instance.zoom || 1;

        const height = 2 * Math.tan(fov / 2) * distance / zoom;
        const width = height * (this.sizes.width / this.sizes.height);

        this.mesh.scale.set(width, height, 1);
    }

    addResizeListener() {
        this.sizes?.on(Sizes.RESIZE_EVENT, () => {
            this.resize();
        });
        console.log(this.world.scroll?.on)
        this.world.scroll?.on(Scroll.ScrollShowStart, () => {
            console.log(Scroll.ScrollShowStart);
            gsap.to(this.mesh.material, {opacity: 0, duration: 1, ease: 'power1.inOut'});
        })
        this.world.scroll?.on(Scroll.ScrollHideStart, () => {
            console.log(Scroll.ScrollHideStart);
            gsap.to(this.mesh.material, {opacity: 1, duration: 4, ease: 'power1.inOut'});
        })
    }

    update() {
        // Jeżeli chcesz dynamiczne efekty — np. animacje w przyszłości
    }
}
