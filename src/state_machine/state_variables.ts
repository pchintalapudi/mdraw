import { RGroup, Bond, StraightArrow, CurvedArrow } from "@/models";
import { Temp, SelectionVariables, Memory } from "./extensions";

class StateVariables {
    public rgroups: RGroup[] = [];
    public bonds: Bond[] = [];
    public straightArrows: StraightArrow[] = [];
    public curvedArrows: CurvedArrow[] = [];
    public selection = new SelectionVariables();
    public temp = new Temp();
    public cache = new Memory();

    public setEntities(rgroups?: RGroup[], bonds?: Bond[],
        // tslint:disable-next-line: align
        straightArrows?: StraightArrow[], curvedArrows?: CurvedArrow[]) {
        this.rgroups = rgroups || this.rgroups;
        this.bonds = bonds || this.bonds;
        this.straightArrows = straightArrows || this.straightArrows;
        this.curvedArrows = curvedArrows || this.curvedArrows;
    }

    public getCopy(field: number):
        [RGroup[] | undefined, Bond[] | undefined, StraightArrow[] | undefined, CurvedArrow[] | undefined] {
        // tslint:disable-next-line: no-bitwise no-conditional-assignment
        return [field & 1 ? [...this.rgroups] : undefined, (field >>= 1) & 1 ? [...this.bonds] : undefined,
        // tslint:disable-next-line: no-bitwise no-conditional-assignment
        (field >>= 1) & 1 ? [...this.straightArrows] : undefined,
        // tslint:disable-next-line: no-bitwise
        (field >> 1) & 1 ? [...this.curvedArrows] : undefined];
    }
}

export default StateVariables;
