const Easings = {
    // 📈 Powolny start, szybki koniec (przyspieszenie)
    easeInQuad: t => t * t,

    // 📉 Szybki start, powolny koniec (zwalnianie)
    easeOutQuad: t => t * (2 - t),

    // 🔁 Powolny start i koniec, szybki środek (płynne wejście i wyjście)
    easeInOutQuad: t =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    // 📈 Jeszcze mocniejsze przyspieszenie niż easeInQuad
    easeInCubic: t => t * t * t,

    // 📉 Mocne zwolnienie pod koniec
    easeOutCubic: t => (--t) * t * t + 1,

    // 🔁 Bardzo płynne przyspieszenie i wyhamowanie (klasyk)
    easeInOutCubic: t =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

    // 📈 Bardzo mocne przyspieszenie (ostre wejście)
    easeInQuart: t => t * t * t * t,

    // 📉 Bardzo mocne zwolnienie (ostre wyjście)
    easeOutQuart: t => 1 - (--t) * t * t * t,

    // 🔁 Mega smooth, ale dramatyczny ease-in i ease-out
    easeInOutQuart: t =>
        t < 0.5
            ? 8 * t * t * t * t
            : 1 - Math.pow(-2 * t + 2, 4) / 2,

    // 🔁 Efekt "przeskoku" po końcu, potem cofnięcie (jak odbicie sprężyny)
    easeOutBack: t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },

    easeOutSnapBack: t => {
        const c1 = 10;    // większy naciąg
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },

    easeOutWhiplash: t => {
        // lekkie przesunięcie poza 1
        const overshoot = 1.3;

        // pierwsza część: zwykły easeOut
        if (t < 0.8) {
            return overshoot * (1 - Math.pow(1 - t / 0.8, 3));
        }

        // ostatnie 20% czasu: szybki powrót do 1
        return overshoot - (overshoot - 1) * ((t - 0.8) / 0.2) ** 4;
    },

    // 🔁 Delikatny backspring na początku i końcu
    easeInOutBack: t => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5
            ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },

    // 🫧 Efekt gumki – wraca i odbija się kilkukrotnie
    easeOutElastic: t => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0
            ? 0
            : t === 1
                ? 1
                : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },

    // 🔁 Wygładzone przejście sinusoidalne (idealne do np. pulsacji)
    easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,

    // 🔁 Trójkątna fala (oscylacja góra-dół)
    easeInOutBounce: t => {
        const bounceOut = t => {
            const n1 = 7.5625;
            const d1 = 2.75;
            if (t < 1 / d1) {
                return n1 * t * t;
            } else if (t < 2 / d1) {
                return n1 * (t -= 1.5 / d1) * t + 0.75;
            } else if (t < 2.5 / d1) {
                return n1 * (t -= 2.25 / d1) * t + 0.9375;
            } else {
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        };

        return t < 0.5
            ? (1 - bounceOut(1 - 2 * t)) / 2
            : (1 + bounceOut(2 * t - 1)) / 2;
    },
};

export default Easings;