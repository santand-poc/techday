import {Card} from "./Card.js";
import Expiriance from "../../Experiance.js";
import {Gate} from "../gate/Gate.js";

export class Deck {
    positions = [];
    cards = []

    constructor() {
        // @formatter:off
        this.expiriance = Expiriance.INSTANCE
        this.world = this.expiriance.world
        this.setCards();
    }


    setCards() {
        this.cards = [
            new Card({index: 0, topTexture: 'beginning', bottomTexture: 'scroll', labelTexture: 'brmsWorldText', scrollContent: 'brmsScrollContent'}),
            new Card({index: 1, topTexture: 'droolsIntro', bottomTexture: 'scroll', labelTexture: 'poskromicText', scrollContent: 'droolsExplanationScrollContent'}),
            new Card({index: 2, topTexture: 'decisionTable', bottomTexture: 'scroll', labelTexture: 'wyborText', scrollContent: 'droolsXlsScrollContent'}),
            new Card({index: 3, topTexture: 'cardTeamTop', bottomTexture: 'scroll', labelTexture: 'lepszePytaniaText', scrollContent: 'paramsInClpScrollContent'}),
            new Card({index: 4, topTexture: 'trollsTeamTop', bottomTexture: 'scroll', labelTexture: 'javaDrlText', scrollContent: 'explodeScrollContent'}),
            new Card({index: 5, topTexture: 'teamPanicTop', bottomTexture: 'scroll', labelTexture: 'droolsXlsText', scrollContent: 'pyramidScrollContent'}),
            new Card({index: 6, topTexture: 'refinementTop', bottomTexture: 'scroll', labelTexture: 'dziedziczenieXlsText', scrollContent: 'ritualScrollContent'}),
            new Card({index: 7, topTexture: 'lambdaResque', bottomTexture: 'scroll', labelTexture: 'lepszyModelText', scrollContent: 'mechanismScrollContent'}),
            new Card({index: 8, topTexture: 'finalTable', bottomTexture: 'scroll', labelTexture: 'przyszłoscText', scrollContent: 'twierdzaScrollContent'}),
            new Card({index: 9, topTexture: 'payment', bottomTexture: 'scroll', labelTexture: 'epilogText', scrollContent: 'mechanism2ScrollContent'}),
            new Card({index: 10, coverTexture: 'fullCardVertical', topTexture: 'scroll', labelTexture: 'pytaniaText', horizontalScale: true, topGeometryFull: true}),
            new Card({index: 11, coverTexture: 'fullCardHorizontal', topTexture: 'scroll', labelTexture: 'lepszePytaniaText', horizontalScale: true, topGeometryFull: true}),
        ];

        // @formatter:on
        this.positions = getPositionCardsInScreenArc(this.cards, 5, -2.5, Math.PI / 2);
        this.positions.forEach(({x, y, z}, index) => this.cards[index].setDefaults(x, y, z));
    }

    update() {
        this.cards.forEach(card => card.update());
    }
}


function getPositionCardsInScreenArc(cards, radius = 2.5, yBase = -2.5, arcAngle = Math.PI / 1.5, zBase = -2) {
    const count = cards.length;
    const angleStep = arcAngle / (count - 1);
    const startAngle = -arcAngle / 2;
    const mid = Math.floor(count / 2);

    return cards.map((card, i) => {
        const angle = startAngle + i * angleStep;
        const x = Math.sin(angle) * radius;
        const distanceFromCenter = Math.abs(i - mid);
        const y = yBase + distanceFromCenter * -0.1;
        const z = zBase - distanceFromCenter * 0.05;
        return {x, y, z};
    });

}