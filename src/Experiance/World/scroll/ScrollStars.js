import * as THREE from 'three';

export default class ScrollStars {
    constructor(scroll) {
        this.scroll = scroll;
        this.scene = scroll.scene;
        this.resources = scroll.resources;
        this.time = scroll.experiance.time;

        this.count = 200;
        this.radius = 2;

        this.setGeometry();
        this.setMaterial();
        this.setPoints();
    }

    setGeometry() {
        this.geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(this.count * 3);
        for (let i = 0; i < this.count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = this.radius * Math.random();
            const height = Math.random() * 2 - 1;

            positions[i * 3 + 0] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }

    setMaterial() {
        this.material = new THREE.PointsMaterial({
            map: this.resources.items.starTexture,
            size: 0.06,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            color: 0xffcc88,
        });
    }

    setPoints() {
        this.points = new THREE.Points(this.geometry, this.material);
        this.points.position.copy(this.scroll.group.position);
        this.scroll.group.add(this.points);
    }

    update() {
        const positions = this.geometry.attributes.position.array;
        const elapsed = this.time.elapsed;

        for (let i = 0; i < this.count; i++) {
            positions[i * 3 + 1] += Math.sin(elapsed + i) * 0.0005;
        }

        this.geometry.attributes.position.needsUpdate = true;
    }
}
