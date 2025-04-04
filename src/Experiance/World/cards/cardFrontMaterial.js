import * as THREE from "three";
import Experience from "../../Experiance.js";

let instance = {};

export default function getCardMaterial(coverTexture) {
    const coverTextureResult = coverTexture ?? 'cardFront';

    if (instance[coverTextureResult]) {
        return instance[coverTextureResult];
    }

    const resources = Experience.INSTANCE.resources.items;

    instance[coverTextureResult] = new THREE.MeshStandardMaterial({
        map: resources[coverTextureResult],
        normalMap: resources.cardFrontNormal,
        roughnessMap: resources.cardFrontRoughness,
        metalnessMap: resources.cardFrontMetalness,
        alphaMap: resources[coverTextureResult + 'Alpha'],
        transparent: true,
        side: THREE.FrontSide,
        roughness: 0.2,
        normalScale: new THREE.Vector2(2, 2)
    })

    return instance[coverTextureResult];
}