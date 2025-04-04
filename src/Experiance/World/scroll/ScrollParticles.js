import * as THREE from 'three';

export default class ScrollParticles {
    constructor(scroll) {
        this.scroll = scroll;
        this.scene = scroll.scene;
        this.time = scroll.experiance.time;
        this.resources = scroll.resources;

        this.count = 30;

        this.runeTextures = [
            this.resources.items.rune1,
            this.resources.items.rune2,
            this.resources.items.rune3,
            this.resources.items.rune4,
            this.resources.items.rune5
        ];

        this.particles = [];

        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const minRadius = 0.8;
            const maxRadius = 2.0;
            const radius = minRadius + Math.random() * (maxRadius - minRadius);

            const material = new THREE.SpriteMaterial({
                map: this.getRandomRune(),
                transparent: true,
                depthWrite: false,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                color: 0xffcc88
            });

            const sprite = new THREE.Sprite(material);

            const scale = 0.1 + Math.random() * 0.05;
            sprite.scale.setScalar(scale);

            this.scroll.group.add(sprite);

            this.particles.push({
                sprite,
                angle,
                radius,
                floatStrength: 0,
                offset: Math.random() * Math.PI * 2,
                rotationSpeed: 0.000005 + Math.random() * 0.000001
            });
        }
    }

    getRandomRune() {
        const index = Math.floor(Math.random() * this.runeTextures.length);
        return this.runeTextures[index];
    }

    update() {
        const t = this.time.elapsed;
        const delta = this.time.delta;

        for (const p of this.particles) {
            // 🔁 obrót w XY
            p.angle += p.rotationSpeed * delta;

            const x = Math.cos(p.angle) * p.radius;
            const y = Math.sin(p.angle) * p.radius + 0.5;
            const z = 0.101 + Math.sin(t * 2 + p.offset) * p.floatStrength; // subtelne "oddychanie" w Z

            p.sprite.position.set(x, y, z);
            p.sprite.material.rotation += 0.002;
        }
    }
}
