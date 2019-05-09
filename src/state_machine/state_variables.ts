import { RGroup, Bond, SelectionRectangle } from "../models";

class StateVariables {
    public selected: RGroup[] = [];
    public rgroups: RGroup[] = [];
    public bonds: Bond[] = [];
    public lastAngle: number = 0;
    public lastPlaced: number = 0;
    public selectionBox = new SelectionRectangle();
    public itime: number = 0;
    public ipos: Array<{ x: number, y: number }> = [];

    public toString() {
        return `RGroups: [${this.rgroups.map((r) => r.asString(true))}]\n
                Selected: [${this.selected.map((r) => r.id).sort()}]\n
                Bonds: [${this.bonds.map((b) => b.asString())}]\n`;
    }

    get creating() {
        return this.rgroups[this.rgroups.length - 1];
    }
}

export default StateVariables;
