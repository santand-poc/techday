import * as THREE from "three";
import Experience from "../Experiance.js";
import Easings from "./Easings.js";

export function animateCardToSlot(card, slot, duration = 1, onComplete = () => {
}) {
    const startTime = performance.now();

    const startPos = card.position.clone();
    const startScale = card.scale.clone();
    const startQuat = card.quaternion.clone();

    const endPos = new THREE.Vector3();
    slot.getWorldPosition(endPos);
    endPos.z += 0.6;
    card.parent.worldToLocal(endPos);

    const endQuat = new THREE.Quaternion();
    slot.getWorldQuaternion(endQuat);

    const cardSize = new THREE.Vector3();
    const slotSize = new THREE.Vector3();

    const cardMesh = card.geometry ? card : card.getObjectByName("CardBase");
    const slotMesh = slot;

    cardMesh.geometry.computeBoundingBox();
    slotMesh.geometry.computeBoundingBox();

    cardMesh.geometry.boundingBox.getSize(cardSize);
    slotMesh.geometry.boundingBox.getSize(slotSize);

    const uniformScale = Math.min(
        slotSize.x / cardSize.x,
        slotSize.y / cardSize.y,
        slotSize.z / cardSize.z
    );

    const endScale = new THREE.Vector3(uniformScale * 0.9, uniformScale * 0.9, uniformScale * 0.9);


    function animate() {
        const elapsed = (performance.now() - startTime) / 1000;
        const t = Math.min(elapsed / duration, 1);
        const easedT = Easings.easeInOutCubic(t);

        card.position.lerpVectors(startPos, endPos, t);
        card.quaternion.copy(startQuat.clone().slerp(endQuat, t));
        card.scale.lerpVectors(startScale, endScale, easedT);

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            onComplete();
        }
    }

    animate();
}

export function animateTo(obj, endPosition, endScale, duration = 1, onComplete = () => {}) {
    const startTime = performance.now();

    const startPos = obj.position.clone();
    const startScale = obj.scale.clone();
    const startRotation = obj.rotation.clone(); // zachowujemy początkową rotację

    const endPos = new THREE.Vector3(endPosition.x, endPosition.y, endPosition.z);
    const totalRotation = THREE.MathUtils.degToRad(-180); // pełny obrót

    function animate() {
        const elapsed = (performance.now() - startTime) / 1000;
        const t = Math.min(elapsed / duration, 1);

        const easedT = Easings.easeOutWhiplash(t);

        obj.position.lerpVectors(startPos, endPos, easedT);
        obj.scale.lerpVectors(startScale, startScale.clone().multiplyScalar(endScale), easedT);

        // Obrót wokół osi Z (pełny spin)
        obj.rotation.y = startRotation.y + totalRotation * easedT;

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            onComplete();
        }
    }

    animate();
}

export function spawnSmokeEffect(target) {
    const smokeMaterial = new THREE.SpriteMaterial({
        map: Experience.INSTANCE.resources.items.smokeTexture,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const smoke = new THREE.Sprite(smokeMaterial);
    smoke.position.set(0, 0, 0.06); // tuż nad obiektem
    smoke.scale.setScalar(5);
    target.add(smoke);

    const fadeStart = performance.now();

    function fade() {
        const fadeElapsed = (performance.now() - fadeStart) / 1500;
        smoke.material.opacity = Math.max(0, 0.8 * (1 - fadeElapsed));
        smoke.scale.setScalar(5 + fadeElapsed);
        if (fadeElapsed < 1) {
            requestAnimationFrame(fade);
        } else {
            smoke.material.dispose();
            target.remove(smoke);
        }
    }

    fade();
}

export function spawnBlastEffect(target) {
    const smokeMaterial = new THREE.SpriteMaterial({
        map: Experience.INSTANCE.resources.items.blastTexture,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const smoke = new THREE.Sprite(smokeMaterial);
    smoke.position.set(0, 0, 0.06); // tuż nad obiektem
    smoke.scale.setScalar(5);
    target.add(smoke);

    const fadeStart = performance.now();

    function fade() {
        const fadeElapsed = (performance.now() - fadeStart) / 1500;
        smoke.material.opacity = Math.max(0, 1 * (1 - fadeElapsed));
        smoke.scale.setScalar(5 + fadeElapsed);
        if (fadeElapsed < 1) {
            requestAnimationFrame(fade);
        } else {
            smoke.material.dispose();
            target.remove(smoke);
        }
    }

    fade();
}

export function rotateRingStep(ringGroup, step = 1, onComplete = () => {
}) {
    const angle = (Math.PI * 2 / 12) * step; // 30° per step
    const startRotation = ringGroup.rotation.z;
    const endRotation = startRotation + angle;
    const duration = 2000; // ms

    const startTime = performance.now();

    function animate() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = Easings.easeInOutCubic(t);

        ringGroup.rotation.z = startRotation + (endRotation - startRotation) * eased;

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            onComplete();
        }
    }

    animate();
}
