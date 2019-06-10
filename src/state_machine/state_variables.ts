import { RGroup, Bond, SelectionRectangle, StraightArrow } from "../models";

class StateVariables {
    public selected: Array<{ x: number, y: number, id: number }> = [];
    public rgroups: RGroup[] = [];
    public bonds: Bond[] = [];
    public straightArrows: StraightArrow[] = [];
    public lastAngle = 0;
    public lastPlaced = 0;
    public count = 0;
    public selectionBox = new SelectionRectangle();
    public itime = 0;
    public ipos: Array<{ x: number, y: number }> = [];
    public file = "";

    public toString() {
        return `RGroups: [${this.rgroups.map((r) => r.asString(true))}]\n
                Selected: [${this.selected.map((r) => r.id).sort()}]\n
                Bonds: [${this.bonds.map((b) => b.asString())}]`;
    }

    get creating() {
        return this.rgroups[this.rgroups.length - 1];
    }
}

export default StateVariables;
