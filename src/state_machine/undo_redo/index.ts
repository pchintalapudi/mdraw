import { StateMachine } from "..";

type Action = (sm: StateMachine) => void;

interface Executed { undo: Action; redo: Action; }

export default class {
    private stack: Executed[] = [];
    private idx: number = -1;
    private savedAction = null as null | Executed;

    public log(undo: Action, redo: Action) {
        this.stack[this.stack.length = ++this.idx] = { undo, redo };
    }

    get canUndo() {
        return this.idx > -1;
    }

    get canRedo() {
        return this.idx < this.stack.length - 1;
    }

    public undo(sm: StateMachine) {
        if (this.canUndo) this.stack[this.idx--].undo(sm);
    }

    public redo(sm: StateMachine) {
        if (this.canRedo) this.stack[++this.idx].redo(sm);
    }

    public markSaved() {
        this.savedAction = this.stack[this.idx];
    }

    get saved() {
        return this.savedAction === this.stack[this.idx];
    }
}
