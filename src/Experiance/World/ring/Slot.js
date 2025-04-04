import * as THREE from "three";

export default function createRingSlots(radius = 2.7, count = 12, that) {
    const slots = [];
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const slotGeometry = new THREE.BoxGeometry(12, 20, 0.6); // rozmiar karty
        const slot = new THREE.Mesh(
            slotGeometry,
            new THREE.MeshStandardMaterial({
                map: that.resources.items.ringSlot,
                roughness: 1,
                metalness: 0,
            })
        );
        slot.userData = {
            name: 'SLOT',
            index: i
        }

        // 🟡 Ustawiamy w płaszczyźnie XY i lekko wysuwamy w stronę kamery (z)
        slot.position.set(x, y, 5); // <- dopasuj do pozycji Twojego pierścienia

        // 🟡 Obracamy przodem do środka
        slot.lookAt(0, 0, 1000);

        // ✅ Korekta nachylenia — żeby "stał pionowo" względem pierścienia
        slot.rotation.z = angle;

        slots.push(slot);
    }
    return slots;
}