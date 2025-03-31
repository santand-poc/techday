import * as THREE from 'three';
import EventEmitter from "./EventEmmiter.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
import {TTFLoader} from "three/examples/jsm/loaders/TTFLoader.js";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader.js";

export default class Resources extends EventEmitter {
    static READY_EVENT = 'ready'

    constructor(sources) {
        super();
        this.sources = sources;
        this.items = {
            SFProText_font: undefined
        };

        this.toLoad = this.sources.length;
        this.loaded = 0;

        if (this.loaded === this.toLoad) {
            console.info("No resources");
            setTimeout(() => this.trigger(Resources.READY_EVENT));
            return;
        }

        this.mixers = [];
        this.actions = []

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.fbxLoader = new FBXLoader();
        this.loaders.tetureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
        this.loaders.fontLoader = new FontLoader();
        this.loaders.ttfLoader = new TTFLoader();
    }

    startLoading() {
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(source.path, (file) => this.sourceModelLoaded(source, file))
            } else if (source.type === 'fbxModel') {
                this.loaders.fbxLoader.load(source.path, (file) => this.sourceModelLoaded(source, file))
            } else if (source.type === 'texture') {
                this.loaders.tetureLoader.load(source.path, (file) => this.sourceLoaded(source, file, true))
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path, (file) => this.sourceLoaded(source, file, true))
            } else if (source.type === 'font') {
                this.loaders.fontLoader.load(source.path, (file) => this.sourceLoaded(source, file))
            } else if (source.type === 'ttf') {
                this.loaders.ttfLoader.load(source.path, (file) => this.sourceTTFLoaded(source, file))
            }
        }
    }

    sourceModelLoaded(source, file) {
        this.sourceLoaded(source, file)
        file.animations.forEach(animation => {
            const mixer = new THREE.AnimationMixer(file);
            this.mixers.push(mixer);
            mixer.clipAction(animation).play()
        })
        this.actions.push(...file.animations.map(animations => {
            try {
                this.mixer.clipAction(animations)
            } catch (e) {
            }
        }));
    }

    sourceTTFLoaded(source, json) {
        this.sourceLoaded(source, new Font(json))
    }

    sourceLoaded(source, file, isTexture) {
        this.items[source.name] = file
        if (isTexture) {
            this.items[source.name].colorSpace = THREE.SRGBColorSpace
        }
        this.loaded++;
        if (this.loaded === this.toLoad) {
            this.trigger(Resources.READY_EVENT)
        }
    }
}