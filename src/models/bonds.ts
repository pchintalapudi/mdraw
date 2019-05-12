import { RGroup } from "../models";
import { IDGenerator } from "./globals";

enum BondState {
    PARTIAL, SINGLE, FORWARD, RETREATING, THICK, DOUBLE, DOUBLE_LEFT, DOUBLE_RIGHT, TRIPLE, TRIPLE_SHORT,
}

class Bond {
    constructor(public start: RGroup, public end: RGroup,
        // tslint:disable-next-line: align
        public state = BondState.SINGLE, public readonly id = IDGenerator.nextID) { }

    public bondOrder() {
        switch (+this.bondOrder) {
            case BondState.PARTIAL:
                return 0;
            case BondState.SINGLE:
            case BondState.FORWARD:
            case BondState.RETREATING:
            case BondState.THICK:
                return 1;
            case BondState.DOUBLE:
            case BondState.DOUBLE_LEFT:
            case BondState.DOUBLE_RIGHT:
                return 2;
            case BondState.TRIPLE:
            case BondState.TRIPLE_SHORT:
                return 3;
            default:
                return -1;
        }
    }

    public peer(rgroup: RGroup, replace?: RGroup) {
        return rgroup === this.start ? this.end = replace || this.end : this.start = replace || this.start;
    }

    public replace(rgroup: RGroup, replacement: RGroup) {
        if (rgroup === this.start) {
            this.start = replacement;
        } else {
            this.end = replacement;
        }
    }

    get cmp() {
        //Cantor pairing function
        return ((this.start.id + this.end.id) * (this.start.id + this.end.id + 1)) / 2 + this.end.id;
    }

    public asString() {
        return `
        Start: ${this.start.asString(true)}\n
        End: ${this.end.asString(true)}\n
        State: ${BondState[this.state]}\n
        `;
    }

    public serialize() {
        return `${this.start.id}@${this.end.id}@${this.state}`;
    }

    // tslint:disable-next-line: member-ordering
    public static deserialize(str: string, rgroupMap: Map<number, RGroup>) {
        const parts = str.split("@");
        const b = new Bond(rgroupMap.get(parseInt(parts[0], 10))!,
            rgroupMap.get(parseInt(parts[1], 10))!, parseInt(parts[2], 10) as BondState);
        b.start.bonds.set(b.end, b);
        b.end.bonds.set(b.start, b);
        return b;
    }
}

export { BondState, Bond };
