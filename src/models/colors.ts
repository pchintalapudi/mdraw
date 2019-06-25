import { RGroup } from "@/models";
enum ElementColor {
    OXYGEN = "e32636",
    FLUORINE = "66ff00",
    CHLORINE = "6f0",
    BROMINE = "a13d2d",
    NITROGEN = "267dff",
    BORON = "b5651d",
    CARBON = "888",
    SULFUR = "ff0",
    SILICON = "aaa",
    DEFAULT = "ccc",
    COPPER = "b87333",
    GOLD = "ffd700",
    PHOSPHORUS = "9b30ff",
    IODINE = "7d26cd",
    HELIUM = "ffe5b4",
    NEON = "ff4500",
    ARGON = "912cee",
    KRYPTON = "fff",
    XENON = "7ec0ee"
}

export const colors = (() => {
    const colorArr: string[] = [];
    // tslint:disable-next-line: forin
    for (const e in ElementColor) {
        colorArr.push(ElementColor[e]);
    }
    return colorArr;
})();

export function getColor(rgroup: RGroup): string {
    return ElementColor[rgroup.payload.name.toUpperCase() as any] || ElementColor.DEFAULT;
}
