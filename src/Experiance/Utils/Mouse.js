import EventEmitter from "./EventEmmiter.js";
import * as THREE from "three";
import Experience from "../Experiance.js";

export default class Mouse extends EventEmitter {
    static MOVE_EVENT = 'mousemove'
    static LEFT_ClICK_EVENT = 'click'
    static RIGHT_ClICK_EVENT = 'contextmenu'
    static O_UP_EVENT = 'o_up'
    static P_UP_EVENT = 'p_up'
    static K_UP_EVENT = 'k_up'
    static L_UP_EVENT = 'l_up'
    static I_UP_EVENT = 'i_up'
    static U_UP_EVENT = 'u_up'
    static J_UP_EVENT = 'j_up'
    static H_UP_EVENT = 'h_up'
    static G_UP_EVENT = 'g_up'
    static F_UP_EVENT = 'f_up'

    constructor() {
        super();
        this.experience = Experience.INSTANCE;
        this.sizes = this.experience.sizes;
        this.instance = new THREE.Vector3(this.sizes.width,this.sizes.height,  0);
        this.watchMove();
        this.watchLeftClick();
        this.watchRightClick();
        this.watchPlusKey();
    }

    watchMove() {
        window.addEventListener('mousemove', (event) => {
            this.instance.x = event.clientX /  this.sizes.width * 2 - 1
            this.instance.y = - (event.clientY /  this.sizes.height) * 2 + 1
            this.trigger(Mouse.MOVE_EVENT)
        })
    }

    watchLeftClick() {
        window.addEventListener('click', () => {
            this.trigger(Mouse.LEFT_ClICK_EVENT)
        })
    }

    watchPlusKey() {
        window.addEventListener('keyup', (e) => {
            if(e.code === 'KeyP') {
                this.trigger(Mouse.P_UP_EVENT)
            }
            if(e.code === 'KeyO') {
                this.trigger(Mouse.O_UP_EVENT)
            }
            if(e.code === 'KeyK') {
                this.trigger(Mouse.K_UP_EVENT)
            }
            if(e.code === 'KeyL') {
                this.trigger(Mouse.L_UP_EVENT)
            }
            if(e.code === 'KeyI') {
                this.trigger(Mouse.I_UP_EVENT)
            }
            if(e.code === 'KeyU') {
                this.trigger(Mouse.U_UP_EVENT)
            }
            if(e.code === 'KeyJ') {
                this.trigger(Mouse.J_UP_EVENT)
            }
            if(e.code === 'KeyH') {
                this.trigger(Mouse.H_UP_EVENT)
            }
            if(e.code === 'KeyG') {
                this.trigger(Mouse.G_UP_EVENT)
            }
            if(e.code === 'KeyF') {
                this.trigger(Mouse.F_UP_EVENT)
            }
        })
    }

    watchRightClick() {
        window.addEventListener('contextmenu', () => {
            this.trigger(Mouse.RIGHT_ClICK_EVENT)
        })
    }
}