import { RGroup } from "../models";

enum BondState {
    PARTIAL, SINGLE, FORWARD, RETREATING, THICK, DOUBLE, DOUBLE_LEFT, DOUBLE_RIGHT, TRIPLE, TRIPLE_SHORT,
}

class Bond {
    constructor(public start: RGroup, public end: RGroup, public state = BondState.SINGLE) { }

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

    public peer(rgroup: RGroup) {
        return rgroup === this.start ? this.end : this.start;
    }

    public asString() {
        return `
        Start: ${this.start.asString(true)}\n
        End: ${this.end.asString(true)}\n
        State: ${BondState[this.state]}\n
        `;
    }
}

export { BondState, Bond };
