import { RGroup } from "../models";
import { IDGenerator } from "./globals";

enum BondState {
    PARTIAL, SINGLE, FORWARD, RETREATING, THICK, DOUBLE, DOUBLE_LEFT, DOUBLE_RIGHT, TRIPLE, TRIPLE_SHORT,
}

class Bond {
    constructor(public start: RGroup, public end: RGroup,
        // tslint:disable-next-line: align
        public state = BondState.SINGLE, public readonly id = IDGenerator.nextID) { }

    get bondOrder() {
        switch (+this.state) {
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

    public asString() {
        return `
        Start: ${this.start.asString(true)}\n
        End: ${this.end.asString(true)}\n
        State: ${BondState[this.state]}\n
        `;
    }

    public serialize() {
        return `${this.id}@${this.start.id}@${this.end.id}@${this.state}`;
    }

    // tslint:disable-next-line: member-ordering
    public static deserialize(str: string, rgroupMap: Map<number, RGroup>): [number, Bond] {
        const parts = str.split("@");
        const b = new Bond(rgroupMap.get(+parts[1])!,
            rgroupMap.get(+parts[2])!, +parts[3] as BondState);
        b.start.bonds.set(b.end, b);
        b.end.bonds.set(b.start, b);
        return [+parts[0], b];
    }

    get omittable() {
        return this.start.omittable || this.end.omittable;
    }

    get x() {
        return (this.start.x + this.end.x) / 2;
    }

    get y() {
        return (this.start.y + this.end.y) / 2;
    }

    public getAngle(rgroup: RGroup) {
        const start = rgroup === this.start;
        const y = this.end.y - this.start.y, x = this.end.x - this.start.x;
        const angle = Math.atan2(start ? y : -y, start ? x : -x);
        return angle;
    }
}

export { BondState, Bond };
