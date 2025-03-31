import EventEmitter from "./EventEmmiter.js";

export default class Time extends EventEmitter {
    static TICK_EVENT = 'tick';
    constructor() {
        super();
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;


        window.requestAnimationFrame(this.tick.bind(this))
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;
        this.trigger(Time.TICK_EVENT)
        window.requestAnimationFrame(this.tick.bind(this))
    }
}