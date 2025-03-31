import Experience from "./Experiance.js";
import * as THREE from "three";
import {EffectComposer, OutputPass, RenderPass, UnrealBloomPass} from "three/addons";

export default class Renderer {

    constructor() {
        this.bloom = new Bloom();
        this.experiance = Experience.INSTANCE;
        this.cssCanvas = this.experiance.cssCanvas
        this.webglCanvas = this.experiance.webglCanvas
        this.sizes = this.experiance.sizes
        this.scene = this.experiance.scene
        this.camera = this.experiance.camera
        this.time = this.experiance.time
        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.webglCanvas,
            antialias: true
        });
        this.instance.setClearColor(0xFFFFFF, 0)
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1
        this.instance.gammaFactor = 2.2
        this.instance.outputColorSpace = THREE.SRGBColorSpace
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    }

    update() {

        this.instance.render(this.scene, this.camera.instance);
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

}

class Bloom {
    constructor() {
        this.BLOOM_SCENE = 1;
        this.layer = new THREE.Layers();
        this.layer.set(this.BLOOM_SCENE);
        this.darkMaterial = new THREE.MeshBasicMaterial({color: 'black'})
        this.matertials = {}
    }

    nonBloomed(obj) {
        if (!obj.clp_bloomed) {
            this.matertials[obj.uuid] = obj.material;
            obj.material = this.darkMaterial;
        }
    }

    restoreMaterial(obj) {
        if (this.matertials[obj.uuid]) {
            obj.material = this.matertials[obj.uuid];
            delete this.matertials[obj.uuid]
        }
    }
}