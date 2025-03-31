import Experience from "../../Experiance.js";
import {RoundedBoxGeometry} from "three/addons";
import * as THREE from "three";
import PlaneLabel from "../texts/PlaneLabel.js";

export class Card {
    defaultPosition = {
        x: 0,
        y: 0,
        z: 0
    }

    constructor(config) {
        this.experiance = Experience.INSTANCE;
        this.scene = this.experiance.scene;
        this.resources = this.experiance.resources;
        this.raycaster = this.experiance.raycaster;
        this.config = config;
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        const topGeometryHeight = this.config.topGeometryFull ? 1.92 : 1.08;
        this.geometry = new RoundedBoxGeometry(1.08, 1.92, 0.04, 100, 0.1);
        this.topPlaneGrometry = new THREE.PlaneGeometry(1.08, topGeometryHeight);
        this.bottomPlaneGrometry = new THREE.PlaneGeometry(1.08, 0.6);
    }

    setMaterial() {
        const coverTextureResult = this.config.coverTexture ?? 'cardFront';
        const topTexture = this.config.topTexture;
        const bottomTexture = this.config.bottomTexture;
        this.materials = {
            right: new THREE.MeshStandardMaterial({color: '#38200e', metalness: 1}),
            left: new THREE.MeshStandardMaterial({color: '#38200e', metalness: 1}),
            top: new THREE.MeshStandardMaterial({color: '#38200e', metalness: 1}),
            bottom: new THREE.MeshStandardMaterial({color: '#38200e', metalness: 1}),
            front: new THREE.MeshStandardMaterial({
                map: this.resources.items[coverTextureResult],
                normalMap: this.resources.items.cardFrontNormal,
                roughnessMap: this.resources.items.cardFrontRoughness,
                metalnessMap: this.resources.items.cardFrontMetalness,
                alphaMap: this.resources.items[coverTextureResult + 'Alpha'],
                transparent: true,
                side: THREE.FrontSide,
                roughness: 0.2,
                normalScale: new THREE.Vector2(2, 2)
            }),
            back: new THREE.MeshStandardMaterial({
                map: this.resources.items.cardBack,
                normalMap: this.resources.items.cardBackNormal,
                roughnessMap: this.resources.items.cardBackRoughness,
                metalnessMap: this.resources.items.cardBackMetalness,
                transparent: true,
                roughness: 0.1,
                side: THREE.FrontSide,
                normalScale: new THREE.Vector2(2, 2)
            }),   // Back
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
        this.mesh.castShadow = true;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.group.add(this.mesh);

        if (this.materials.innerTop) {
            this.topPlane = new THREE.Mesh(
                this.topPlaneGrometry,
                this.materials.innerTop
            );
            this.topPlane.castShadow = true;
            this.topPlane.castShadow = true;
            this.topPlane.position.y = topGeometryFull ? 0 : 0.35;
            this.topPlane.position.z = -0.02;
            this.group.add(this.topPlane);
        }

        if (this.materials.innerBottom) {
            this.bottomPlane = new THREE.Mesh(
                this.bottomPlaneGrometry,
                this.materials.innerBottom
            );
            this.bottomPlane.castShadow = true;
            this.bottomPlane.castShadow = true;
            this.bottomPlane.position.y = -0.6;
            this.group.add(this.bottomPlane);
        }

        if (labelTexture) {
            // this.labelText = new LabelText({ text: labelText }).mesh;
            this.labelText = new PlaneLabel({ texture: labelTexture }).mesh;
            this.labelText.position.z = 0.026;
            this.labelText.position.y = -0.26;
            this.group.add(this.labelText);
        }

        this.scene.add(this.group);
        this.geometry = new RoundedBoxGeometry(1.08, 1.92, 0.04, 100, 0.1);


        this.intesectMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.08, 1.92),
            new THREE.MeshBasicMaterial({
                color: 'green',
                opacity: 0,
                transparent: true,
                wireframe: true,
                side: THREE.DoubleSide
            })
        );
        this.group.rotation.y = Math.PI;
        this.scene.add(this.intesectMesh);
        this.scene.add(this.group);
    }

    update() {
        const horizontalScale = this.config.horizontalScale;
        if (this.isHovered()) {
            this.group.scale.set(3.5, 3.5, 3.5);
            this.group.position.x = 0;
            this.group.position.y = 0;
            this.group.position.z = 1;
            if (this.group.rotation.y < (Math.PI * 2)) {
                this.group.rotation.y += 0.07;
            }
            if (horizontalScale) {
                this.group.rotation.z = -Math.PI / 2;
            }
        } else {
            this.group.scale.set(1, 1, 1);
            this.group.position.x = this.defaultPosition.x;
            this.group.position.y = this.defaultPosition.y;
            this.group.position.z = this.defaultPosition.z;
            // if (this.group.rotation.y > Math.PI) {
            //     this.group.rotation.y -= 0.07;
            // }
            this.group.rotation.y = Math.PI;
            this.group.rotation.z = 0;
        }


    }

    isHovered() {
        return this.raycaster?.intersecttions?.some(intersection => {
            return intersection.object.uuid === this.intesectMesh.uuid;
        });
    }

    setDefaultPosition(x, y, z) {
        if (x !== undefined) {
            this.group.position.x = x;
            this.intesectMesh.position.x = x;
            this.defaultPosition.x = x;
        }
        if (y !== undefined) {
            this.group.position.y = y;
            this.intesectMesh.position.y = y;
            this.defaultPosition.y = y;
        }
        if (z !== undefined) {
            this.group.position.z = z;
            this.intesectMesh.position.z = 1;
            this.defaultPosition.z = z;
        }
    }
}