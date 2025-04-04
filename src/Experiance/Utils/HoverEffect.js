import gsap from "gsap";

export default class HoverEffect {
    constructor(objects, options = {}) {
        this.objects = Array.isArray(objects) ? objects : [objects];

        this.hoverY = options.hoverY ?? 1;
        this.duration = options.duration ?? 0.4;
        this.easeIn = options.easeIn ?? "back.out(1.7)";
        this.easeOut = options.easeOut ?? "power2.inOut";

        this.baseYs = this.objects.map((obj) => obj.position.y);
        this.active = false;
    }

    hoverOn() {
        if (this.active) return;

        this.objects.forEach((obj, i) => {
            gsap.killTweensOf(obj.position);
            gsap.to(obj.position, {
                y: this.baseYs[i] + this.hoverY,
                duration: this.duration,
                ease: this.easeIn
            });
        });

        this.active = true;
    }

    hoverOff() {
        if (!this.active) return;

        this.objects.forEach((obj, i) => {
            gsap.killTweensOf(obj.position);
            gsap.to(obj.position, {
                y: this.baseYs[i],
                duration: this.duration,
                ease: this.easeOut
            });
        });

        this.active = false;
    }
}
