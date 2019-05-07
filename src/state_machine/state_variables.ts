import { RGroup, Bond } from "../models";

class StateVariables {
    public selected: RGroup[] = [];
    public rgroups: RGroup[] = [];
    public bonds: Bond[] = [];
    public lastAngle: number = 0;

    public toString() {
        return `RGroups: ${this.rgroups.map((r) => r.asString(true))}\n
                Selected: ${this.selected.map((r) => r.id).sort()}\n
                Bonds:${this.bonds.map((b) => b.asString())}\n`;
    }
}

export default StateVariables;
