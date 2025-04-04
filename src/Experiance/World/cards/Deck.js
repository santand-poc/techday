import {Card} from "./Card.js";

export class Deck {
    cards = [];

    constructor() {
        // @formatter:off

        this.cards = [
            new Card({index: 0, topTexture: 'beginning', bottomTexture: 'scroll', labelTexture: 'brmsWorldText'}),
            new Card({index: 1, topTexture: 'droolsIntro', bottomTexture: 'scroll'}),
            new Card({index: 2, topTexture: 'decisionTable', bottomTexture: 'scroll'}),
            new Card({index: 3, topTexture: 'cardTeamTop', bottomTexture: 'scroll'}),
            new Card({index: 4, topTexture: 'trollsTeamTop', bottomTexture: 'scroll'}),
            new Card({index: 5, topTexture: 'teamPanicTop', bottomTexture: 'scroll'}),
            new Card({index: 6, topTexture: 'refinementTop', bottomTexture: 'scroll'}),
            new Card({index: 7, topTexture: 'lambdaResque', bottomTexture: 'scroll'}),
            new Card({index: 8, topTexture: 'finalTable', bottomTexture: 'scroll'}),
            new Card({index: 9, topTexture: 'payment', bottomTexture: 'scroll'}),
            new Card({index: 10, coverTexture: 'fullCardVertical', topTexture: 'scroll', horizontalScale: true, topGeometryFull: true}),
            new Card({index: 11, coverTexture: 'fullCardHorizontal', topTexture: 'scroll', horizontalScale: true, topGeometryFull: true}),
        ];

        // @formatter:on
        positionCardsInScreenArc(this.cards, 5, -2.5, Math.PI / 2);
    }

    update() {
        this.cards.forEach(card => card.update());
    }
}


function positionCardsInScreenArc(cards, radius = 2.5, yBase = -2.5, arcAngle = Math.PI / 1.5, zBase = -2) {
    const count = cards.length;
    const angleStep = arcAngle / (count - 1);
    const startAngle = -arcAngle / 2;
    const mid = Math.floor(count / 2);

    cards.forEach((card, i) => {
        const angle = startAngle + i * angleStep;
        const x = Math.sin(angle) * radius;
        const distanceFromCenter = Math.abs(i - mid);
        const y = yBase + distanceFromCenter * -0.1;
        const z = zBase - distanceFromCenter * 0.05;
        card.setDefaults(x, y, z);
    });
}