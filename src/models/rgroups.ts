import element_defs from "./elements";
import { IDGenerator } from "./globals";
import { Bond, LonePair } from "./index";

type ChemicalElement = typeof element_defs[0];

interface Payload {
    readonly name: string;
    readonly abbrev: string;
}

class RGroup {

    public bonds = new Map<RGroup, Bond>();
    public lonePairs: LonePair[] = [];

    constructor(public payload: Payload, public x = 0, public y = 0,
        // tslint:disable-next-line: align
        public charge = 0, public id = IDGenerator.nextID) { }

    public asString(terse = false) {
        return `
    Payload: ${JSON.stringify(this.payload)}\n
    Location: (${this.x}, ${this.y})\n
    Charge: ${this.charge}\n
    ID: ${this.id}\n
    Bonds: ${terse ? this.bonds.size : this.bonds}\n
    Lone Pairs: ${this.lonePairs}
    `;
    }
    public toString() {
        return this.asString();
    }

    public serialize() {
        return `${this.id}@${this.payload.name}@${this.payload.abbrev}@
            ${this.x}@${this.y}@${this.charge}@${this.lonePairs.map(lp => lp.serialize()).join("&")}`;
    }

    // tslint:disable-next-line: member-ordering
    public static deserialize(str: string): [number, RGroup, Array<[number, LonePair]>] {
        const parts = str.split("@");
        const rg = new RGroup({ name: parts[1], abbrev: parts[2] },
            parseFloat(parts[3]), parseFloat(parts[4]), parseFloat(parts[5]));
        const lonePairs = parts[6].split("&").filter(s => s).map(s => LonePair.deserialize(s, rg));
        rg.lonePairs = lonePairs.map(l => l[1]);
        return [+parts[0], rg, lonePairs];
    }

    get softOmittable() {
        return (
            this.payload.name === "Carbon" && this.bonds.size > 0
        );
    }
    get omittable() {
        return (
            this.payload.name === "Hydrogen" &&
            this.bonds.size === 1 &&
            this.bonds.keys().next().value.payload.name === "Carbon"
        );
    }

    get radius() {
        return this.payload.abbrev.length * 5 + 5;
    }
}

export { ChemicalElement, Payload, RGroup };
