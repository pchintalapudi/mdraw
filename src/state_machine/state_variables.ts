import { RGroup, Bond, SelectionRectangle, StraightArrow } from "../models";
import { StateMachine, Action as StateMachineActions } from "./index";

type Action = (stateMachine: StateMachine) => void;

class UndoableAction {
    constructor(public undo: Action, public redo: Action) { }
}

function getValidBonds(rgroups: RGroup[]) {
    const rgroupSet = new Set<RGroup>(rgroups);
    const bonds = new Set<Bond>();
    for (const rgroup of rgroups) {
        rgroup.bonds.forEach((b, r) => {
            if (rgroupSet.has(r) && !bonds.has(b)) {
                bonds.add(b);
            }
        });
    }
    return Array.from(bonds);
}

function serialize(rgroups: RGroup[], bonds: Bond[], straightArrows: StraightArrow[]) {
    return `${rgroups.map(r => r.serialize()).join()}!${bonds.map(b => b.serialize()).join()}`;
}

function deserialize(str: string): [RGroup[], Bond[]] {
    const strings = str.split("!");
    const rgroupMap = new Map(strings[0].split(",").filter(s => s).map(s => RGroup.deserialize(s)));
    const bonds = strings[1].split(",").filter(s => s).map(s => Bond.deserialize(s, rgroupMap));
    return [Array.from(rgroupMap.values()), bonds];
}

// tslint:disable-next-line: max-classes-per-file
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
    private undoQueue: UndoableAction[] = [];
    private redoQueue: UndoableAction[] = [];
    private savedLength = 0;

    public toString() {
        return `RGroups: [${this.rgroups.map((r) => r.asString(true))}]\n
                Selected: [${this.selected.map((r) => r.id).sort()}]\n
                Bonds: [${this.bonds.map((b) => b.asString())}]`;
    }

    get creating() {
        return this.rgroups[this.rgroups.length - 1];
    }

    public log(undo: Action, redo: Action) {
        this.redoQueue.length = 0;
        this.undoQueue.push(new UndoableAction(undo, redo));
    }

    get canUndo() {
        return this.undoQueue.length;
    }

    get canRedo() {
        return this.redoQueue.length;
    }

    public undo(stateMachine: StateMachine) {
        if (this.canUndo) {
            this.selected.length = 0;
            stateMachine.execute(StateMachineActions.CANCEL, undefined as any);
            const action = this.undoQueue.pop()!;
            action.undo(stateMachine);
            this.redoQueue.push(action);
        }
    }

    public redo(stateMachine: StateMachine) {
        if (this.canRedo) {
            this.selected.length = 0;
            stateMachine.execute(StateMachineActions.CANCEL, undefined as any);
            const action = this.redoQueue.pop()!;
            action.redo(stateMachine);
            this.undoQueue.push(action);
        }
    }

    public serialize() {
        return serialize(this.rgroups, this.bonds, this.straightArrows);
    }

    public save() {
        this.savedLength = this.undoQueue.length;
    }

    get saved() {
        return this.savedLength === this.undoQueue.length;
    }

    public deserialize(str: string, clear = false) {
        if (!clear) {
            const vars = deserialize(str);
            const ilenr = this.rgroups.length;
            const ilenb = this.bonds.length;
            const undo = (sm: StateMachine) => {
                sm.stateVariables.rgroups.splice(ilenr, vars[0].length);
                sm.stateVariables.bonds.splice(ilenb, vars[1].length);
            };
            const redo = (sm: StateMachine) => {
                sm.stateVariables.rgroups.push(...vars[0]);
                sm.stateVariables.bonds.push(...vars[1]);
            };
            this.rgroups.push(...vars[0]);
            this.bonds.push(...vars[1]);
            this.log(undo, redo);
            this.selected = vars[0];
        } else {
            const vars = deserialize(str);
            const beforeRGroups = this.rgroups;
            const beforeBonds = this.bonds;
            const undo = (sm: StateMachine) => {
                sm.stateVariables.rgroups = beforeRGroups;
                sm.stateVariables.bonds = beforeBonds;
            };
            const redo = (sm: StateMachine) => {
                sm.stateVariables.rgroups = vars[0];
                sm.stateVariables.bonds = vars[1];
            };
            this.log(undo, redo);
            this.rgroups = vars[0];
            this.bonds = vars[1];
            this.save();
        }
    }

    public copy() {
        const rgroupsSelected = this.selected.filter(r => r instanceof RGroup) as RGroup[];
        return serialize(rgroupsSelected, getValidBonds(rgroupsSelected),
            this.selected.filter(s => s instanceof StraightArrow) as StraightArrow[]);
    }

    public delete() {
        const removedRGroups = new Map<RGroup, number>();
        const removedStraightArrows = new Map<StraightArrow, number>();
        this.selected.forEach(r => r instanceof RGroup ?
            removedRGroups.set(r, -1) :
            r instanceof StraightArrow && removedStraightArrows.set(r, -1));
        for (let i = 0; i < this.rgroups.length; i++) {
            if (removedRGroups.has(this.rgroups[i])) {
                removedRGroups.set(this.rgroups[i], i);
            }
        }
        for (let i = 0; i < this.straightArrows.length; i++) {
            if (removedStraightArrows.has(this.straightArrows[i])) {
                removedStraightArrows.set(this.straightArrows[i], i);
            }
        }
        const removedBonds = new Map<Bond, number>();
        this.selected.filter(s => s instanceof RGroup).map(r => (r as RGroup).bonds)
            .forEach(bmap => bmap.forEach(b => removedBonds.set(b, -1)));
        for (let i = 0; i < this.bonds.length; i++) {
            if (removedBonds.has(this.bonds[i])) {
                removedBonds.set(this.bonds[i], i);
            }
        }
        const undo = (sm: StateMachine) => {
            const newRGroups: RGroup[] = [];
            const newBonds: Bond[] = [];
            const newStraightArrows: StraightArrow[] = [];
            newRGroups.length = sm.stateVariables.rgroups.length + removedRGroups.size;
            newBonds.length = sm.stateVariables.bonds.length + removedBonds.size;
            removedRGroups.forEach((i, r) => newRGroups[i] = r);
            removedBonds.forEach((i, b) => newBonds[i] = b);
            removedStraightArrows.forEach((i, s) => newStraightArrows[i] = s);
            let j = -1;
            for (const r of sm.stateVariables.rgroups) {
                while (newRGroups[++j]);
                newRGroups[j] = r;
            }
            j = -1;
            for (const b of sm.stateVariables.bonds) {
                while (newBonds[++j]);
                newBonds[j] = b;
            }
            j = -1;
            for (const s of sm.stateVariables.straightArrows) {
                while (newBonds[++j]);
                newStraightArrows[j] = s;
            }
            sm.stateVariables.rgroups = newRGroups;
            sm.stateVariables.bonds = newBonds;
            sm.stateVariables.straightArrows = newStraightArrows;
        };
        const redo = (sm: StateMachine) => {
            sm.stateVariables.rgroups = sm.stateVariables.rgroups.filter(r => !removedRGroups.has(r));
            sm.stateVariables.bonds = sm.stateVariables.bonds.filter(b => !removedBonds.has(b));
            sm.stateVariables.straightArrows =
                sm.stateVariables.straightArrows.filter(s => !removedStraightArrows.has(s));
        };
        this.log(undo, redo);
        this.rgroups = this.rgroups.filter(r => !removedRGroups.has(r));
        this.bonds = this.bonds.filter(b => !removedBonds.has(b));
    }
}

export default StateVariables;
