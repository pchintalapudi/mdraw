/*tslint:disable:align*/

class Constants {
    constructor(public readonly bondLength: number,
        public readonly scrollDistance: number,
        public readonly frameTime: number,
        public readonly screenScrollWidth: number,
        public readonly baseFontSize: number) { }
}

function getFontSize() {
    const computedFontSize = window.getComputedStyle(document.documentElement).getPropertyValue("font-size");
    return +computedFontSize.slice(0, computedFontSize.length - 2);
}

const constants = new Constants(50, 7.5, 12.5, 50, getFontSize());

export { constants as Constants };
