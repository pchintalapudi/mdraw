import { RGroup, Bond, SelectionRectangle } from "../models";

class StateVariables {
    public selected: RGroup[] = [];
    public rgroups: RGroup[] = [];
    public bonds: Bond[] = [];
    public lastAngle: number = 0;
    public selectionBox = new SelectionRectangle();

    public toString() {
        return `RGroups: [${this.rgroups.map((r) => r.asString(true))}]\n
                Selected: [${this.selected.map((r) => r.id).sort()}]\n
                Bonds: [${this.bonds.map((b) => b.asString())}]\n`;
    }
}

export default StateVariables;
