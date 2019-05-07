import element_defs from "./elements";
import { IDGenerator } from "./globals";
import { Bond } from "./index";

type ChemicalElement = typeof element_defs[0];

interface Payload {
    name: string;
    symbol: string;
    abbrev?: string;
}

class RGroup {

    public bonds = new Map<RGroup, Bond>();

    constructor(public payload: Payload, public x = 0, public y = 0,
        // tslint:disable-next-line: align
        public charge = 0, public id = IDGenerator.nextID) { }

    public asString(terse = false) {
        return `
    Payload: ${JSON.stringify(this.payload)}\n
    Location: (${this.x}, ${this.y})\n
    Charge: ${this.charge}\n
    ID: ${this.id}
    Bonds: ${terse ? this.bonds.size : this.bonds}
    `;
    }
    public toString() {
        return this.asString();
    }
}

export { ChemicalElement, Payload, RGroup };
