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

    fadeIn() {
        gsap.killTweensOf(this.uniform);
        gsap.to(this.uniform, {
            value: this.max,
            duration: this.duration,
            ease: this.easeIn
        });
    }

    fadeOut() {
        gsap.killTweensOf(this.uniform);
        gsap.to(this.uniform, {
            value: this.min,
            duration: this.duration,
            ease: this.easeOut
        });
    }

    pulse(scale = 2.5, duration = 0.6) {
        gsap.killTweensOf(this.uniform);
        gsap.to(this.uniform, {
            value: scale,
            duration: duration * 0.5,
            ease: "power3.out",
            yoyo: true,
            repeat: 1
        });
    }

    set(value) {
        this.uniform.value = value;
    }
}
