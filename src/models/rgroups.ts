import element_defs from "./elements";
import { IDGenerator } from "./globals";
import { Bond, element } from "./index";

type ChemicalElement = typeof element_defs[0];

interface Payload {
    name: string;
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

    public serialize() {
        if ((this.payload as ChemicalElement).number !== undefined) {
            return `${this.id}@A${(this.payload as ChemicalElement).number}@${this.x}@${this.y}@${this.charge}`;
        }
    }

    // tslint:disable-next-line: member-ordering
    public static deserialize(str: string): [number, RGroup] {
        const parts = str.split("@");
        if (parts[1][0] === "A") {
            return [parseInt(parts[0], 10),
            new RGroup(element(parseInt(parts[1].substring(1), 10)),
                parseFloat(parts[2]), parseFloat(parts[3]), parseFloat(parts[4]))];
        } else {
            return undefined as any as [number, RGroup];
        }
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
}

export { ChemicalElement, Payload, RGroup };
