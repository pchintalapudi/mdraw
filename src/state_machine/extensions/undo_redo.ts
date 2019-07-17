import { StateMachine } from "..";
import Action from "../actions";

type Operation = (sm: StateMachine) => void;

interface Frame { undo: Operation; redo: Operation; }

export class History {
    private stack: Frame[] = [];
    private idx: number = -1;
    private savedAction = null as null | Frame;

    public log(undo: Operation, redo: Operation) {
        this.stack[this.stack.length = ++this.idx] = { undo, redo };
        if (this.stack.length > 50) this.stack.splice(0, 1);
    }

    get canUndo() {
        return this.idx > -1;
    }

    get canRedo() {
        return this.idx < this.stack.length - 1;
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

    protected undo_internal(sm: StateMachine) {
        if (this.canUndo) {
            sm.execute(Action.CANCEL, undefined as any);
            sm.stateVariables.selected.length = 0;
            this.stack[this.idx--].undo(sm);
        }
    }

    protected redo_internal(sm: StateMachine) {
        if (this.canRedo) {
            sm.execute(Action.CANCEL, undefined as any);
            sm.stateVariables.selected.length = 0;
            this.stack[++this.idx].redo(sm);
        }
    }
}
