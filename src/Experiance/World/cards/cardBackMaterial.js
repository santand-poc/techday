import * as THREE from "three";
import Experience from "../../Experiance.js";

let instance = null;

export default function getCardBackMaterial() {
    if (instance) return instance;

    const resources = Experience.INSTANCE.resources.items;

    instance = new THREE.MeshStandardMaterial({
        map: resources.cardBack,
        normalMap: resources.cardBackNormal,
        roughnessMap: resources.cardBackRoughness,
        metalnessMap: resources.cardBackMetalness,
        transparent: true,
        roughness: 0.1,
        side: THREE.DoubleSide,
        normalScale: new THREE.Vector2(2, 2)
    });

    return instance;
}