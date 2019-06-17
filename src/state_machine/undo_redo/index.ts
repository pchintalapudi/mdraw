import { StateMachine } from "..";
import Action from "../actions";

type Operation = (sm: StateMachine) => void;

interface Frame { undo: Operation; redo: Operation; }

export default class {
    private stack: Frame[] = [];
    private idx: number = -1;
    private savedAction = null as null | Frame;

    public log(undo: Operation, redo: Operation) {
        this.stack[this.stack.length = ++this.idx] = { undo, redo };
    }

    get canUndo() {
        return this.idx > -1;
    }

    get canRedo() {
        return this.idx < this.stack.length - 1;
    }

    public undo(sm: StateMachine) {
        if (this.canUndo) {
            sm.execute(Action.CANCEL, undefined as any);
            sm.stateVariables.selected.length = 0;
            this.stack[this.idx--].undo(sm);
        }
    }

    public redo(sm: StateMachine) {
        if (this.canRedo) {
            sm.execute(Action.CANCEL, undefined as any);
            sm.stateVariables.selected.length = 0;
            this.stack[++this.idx].redo(sm);
        }
    }

    public drop(frameCount: number) {
        this.stack.length = (this.idx = Math.max(this.idx - frameCount, -1)) + 1;
    }

    public markSaved() {
        this.savedAction = this.stack[this.idx];
    }

    get saved() {
        return this.savedAction === this.stack[this.idx];
    }
}
