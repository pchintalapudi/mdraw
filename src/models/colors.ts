import { RGroup } from "@/models";
export enum ElementColor {
    OXYGEN = "#f20",
    HALOGEN = "#2f4",
    NITROGEN = "#08f",
    BORON = "brown",
    CARBON = "black",
    SULFUR = "#ff0",
    SILICON = "gray",
    DEFAULT = "silver",
    COPPER = "indianred",
    GOLD = "gold",
    PHOSPHORUS = "darkorchid",
    IODINE = "purple",
    HELIUM = "peachpuff",
    NEON = "orangered",
    ARGON = "fuchsia",
    KRYPTON = "wheat",
    XENON = "paleturquoise"
}

export function getColor(rgroup: RGroup): string {
    return ElementColor[rgroup.payload.name.toUpperCase() as any] || ElementColor.DEFAULT;
}
