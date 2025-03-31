import Experience from "../../Experiance.js";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import * as THREE from 'three';
import {Color} from "three";

export default class LabelText {
    constructor(config) {
        this.config = config;
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        const text = this.config.text;
        this.geometry = new TextGeometry(text, {
            font: this.resources.items.defaultFont,
            size: 0.05,
            height: 0.001,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.001,
            bevelSize: 0.001,
            bevelOffset: 0,
            bevelSegments: 5
        })
        this.geometry.computeBoundingBox()
        this.geometry.translate(
            -this.geometry.boundingBox.max.x * 0.5,
            -this.geometry.boundingBox.max.y * 0.5,
            -this.geometry.boundingBox.max.z * 0.5
        )
    }

    setTextures() {
        this.textures = {}
        this.textures.color = new Color('black');
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.anisotropy = 16
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            color: this.textures.color
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
    }



    update() {
        this.mesh?.quaternion.copy(Experience.INSTANCE.camera.instance.quaternion);
    }
}