import Experience from "../Experiance.js";
import Resources from "../Utils/Resources.js";
import * as THREE from 'three';
import {Card} from "./cards/Card.js";
import Environment from "../Environment.js";
import MagicBall from "./ball/MagicBall.js";

export default class World {

    constructor() {
        this.experiance = Experience.INSTANCE;
        this.resources = this.experiance.resources;
        this.scene = this.experiance.scene;
        this.cards = [];
        this.angle = 0;

        this.resources.on(Resources.READY_EVENT, () => {
            console.info('Resources ready');
            const offsetX = 0;

            const cardm2 = new Card({topTexture: 'beginning', bottomTexture: 'scroll', labelTexture: 'brmsWorldText'});
            cardm2.setDefaultPosition(offsetX + -2.2, 2);
            this.cards.push(cardm2);

            const cardm1 = new Card({topTexture: 'droolsIntro', bottomTexture: 'scroll'});
            cardm1.setDefaultPosition(offsetX + -1.1, 2);
            this.cards.push(cardm1);

            const card = new Card({topTexture: 'decisionTable', bottomTexture: 'scroll'});
            card.setDefaultPosition(offsetX, 2);
            this.cards.push(card);

            const card1 = new Card({topTexture: 'cardTeamTop', bottomTexture: 'scroll'});
            card1.setDefaultPosition(offsetX + 1.1, 2);
            this.cards.push(card1);

            const card2 = new Card({topTexture: 'trollsTeamTop', bottomTexture: 'scroll'});
            card2.setDefaultPosition(offsetX + 2.2, 2);
            this.cards.push(card2);

            const cardbm2 = new Card({topTexture: 'teamPanicTop', bottomTexture: 'scroll'});
            cardbm2.setDefaultPosition(offsetX + -2.2);
            this.cards.push(cardbm2);

            const cardbm1 = new Card({topTexture: 'refinementTop', bottomTexture: 'scroll'});
            cardbm1.setDefaultPosition(offsetX + -1.1);
            this.cards.push(cardbm1);

            const cardb = new Card({topTexture: 'lambdaResque', bottomTexture: 'scroll'});
            cardb.setDefaultPosition(offsetX);
            this.cards.push(cardb);

            const cardb1 = new Card({topTexture: 'finalTable', bottomTexture: 'scroll'});
            cardb1.setDefaultPosition(offsetX + 1.1);
            this.cards.push(cardb1);

            const cardb2 = new Card({topTexture: 'payment', bottomTexture: 'scroll'});
            cardb2.setDefaultPosition(offsetX + 2.2);
            this.cards.push(cardb2);

            const fullCard = new Card({coverTexture: 'fullCard', topTexture: 'scroll', horizontalScale: true, topGeometryFull: true});
            fullCard.setDefaultPosition(offsetX + -1.1, -2);
            this.cards.push(fullCard);

            const fullCard2 = new Card({coverTexture: 'fullCardHorizontal', topTexture: 'scroll', horizontalScale: true, topGeometryFull: true});
            fullCard2.setDefaultPosition(offsetX, -2);
            this.cards.push(fullCard2);

            const fullCard3 = new Card({coverTexture: 'fullCardVertical', topTexture: 'scroll', topGeometryFull: true});
            fullCard3.setDefaultPosition(offsetX + 1.1, -2);
            this.cards.push(fullCard3);

            arrangeInCircle(this.cards, 5);

            this.magicBall = new MagicBall();

            this.spot = new THREE.SpotLight(0xffe7b0, 50, 5, Math.PI / 3);
            this.spot.position.set(0, 0, 3);
            this.scene.add(this.spot);
            // this.spotHelper = new THREE.SpotLightHelper(this.spot)
            // this.scene.add(this.spotHelper);

            this.spotBack = new THREE.SpotLight(0xffe7b0, 50, 5, Math.PI / 3);
            this.spotBack.position.set(0, 0, -3);
            this.scene.add(this.spotBack);
            // this.spotBackHelper = new THREE.SpotLightHelper(this.spotBack)
            // this.scene.add(this.spotBackHelper);

            this.directional = new THREE.DirectionalLight(0xffffff, 2);
            this.directional.position.set(-1, 0, 2);
            this.scene.add(this.directional);
            // this.directionalHelper = new THREE.DirectionalLightHelper(this.directional);
            // this.scene.add(this.directionalHelper);

            let ambientLight = new THREE.AmbientLight('white', 5);
            this.scene.add(ambientLight);

            this.environment = new Environment();
        })
    }

    update() {
        this.magicBall?.update();
        this.cards.forEach(card => card.update());
        this.angle += 0.05;
        const radius = 4;
        if (this.directional) {
            this.directional.position.x = Math.sin(this.angle) * radius;
            this.directional.position.z = Math.cos(this.angle) * radius;
            this.directional.lookAt(0, 0, 0)
        }
    }
}

function arrangeInCircle(objects, radius) {
    const count = objects.length;
    const angleStep = (Math.PI * 2) / count;

    objects.forEach((obj, i) => {
        const angle = i * angleStep;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        obj.setDefaultPosition(x, y);
    });
}