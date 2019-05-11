import { RGroup, Bond, SelectionRectangle } from "../models";
import { StateMachine, Action as StateMachineActions } from "./index";

type Action = (stateMachine: StateMachine) => void;

class UndoableAction {
    constructor(public undo: Action, public redo: Action) { }
}

// tslint:disable-next-line: max-classes-per-file
class StateVariables {
    public selected: RGroup[] = [];
    public rgroups: RGroup[] = [];
    public bonds: Bond[] = [];
    public lastAngle: number = 0;
    public lastPlaced: number = 0;
    public selectionBox = new SelectionRectangle();
    public itime: number = 0;
    public ipos: Array<{ x: number, y: number }> = [];
    private undoQueue: UndoableAction[] = [];
    private redoQueue: UndoableAction[] = [];

    public toString() {
        return `RGroups: [${this.rgroups.map((r) => r.asString(true))}]\n
                Selected: [${this.selected.map((r) => r.id).sort()}]\n
                Bonds: [${this.bonds.map((b) => b.asString())}]\n`;
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
            stateMachine.execute(StateMachineActions.CANCEL, undefined as any);
            const action = this.undoQueue.pop()!;
            action.undo(stateMachine);
            this.redoQueue.push(action);
        }
    }

    public redo(stateMachine: StateMachine) {
        if (this.canRedo) {
            stateMachine.execute(StateMachineActions.CANCEL, undefined as any);
            const action = this.redoQueue.pop()!;
            action.redo(stateMachine);
            this.undoQueue.push(action);
        }
    }
}

export default StateVariables;
