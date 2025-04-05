import gsap from "gsap";

export default class GlowEffect {
    constructor(material, options = {}) {
        this.material = material;
        this.uniform = material.uniforms.glowStrength;
        this.duration = options.duration ?? 0.4;
        this.max = options.max ?? 1.0;
        this.min = options.min ?? 0.0;
        this.easeIn = options.easeIn ?? "sine.out";
        this.easeOut = options.easeOut ?? "power3.out";
    }

    fadeIn(duration) {
        gsap.killTweensOf(this.uniform);
        gsap.to(this.uniform, {
            value: this.max,
            duration: duration ?? this.duration,
            ease: this.easeIn
        });
    }

    fadeOut(duration) {
        gsap.killTweensOf(this.uniform);
        gsap.to(this.uniform, {
            value: this.min,
            duration: duration ?? this.duration,
            ease: this.easeOut
        });
    }

    fadeOutFor(duration) {
        gsap.to(this.material.uniforms.glowStrength, {
            value: this.min,
            duration: duration ?? this.duration,
            ease: 'power2.out'
        });
    }
}
