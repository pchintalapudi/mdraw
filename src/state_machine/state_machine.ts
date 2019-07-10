import State from "./state";
import StateVariables from "./state_variables";
import Action from "./actions";
import { actions } from "./transitions";
import { History, MapStruct } from "./extensions";
import { save, load, deleteSelected as delSel } from "./marshal_unmarshal";

class StateMachineBase extends History {

    public stateVariables = new StateVariables();
    public lastAction = Action.__COUNT__;
    public view = new MapStruct(this.stateVariables.rgroups, this.stateVariables.bonds,
        this.stateVariables.straightArrows, this.stateVariables.curvedArrows);
    // tslint:disable-next-line: variable-name
    private _state = State.IDLE;

    get state() {
        return this._state;
    }

    set state(state: State) {
        if (this._state !== state) {
            // tslint:disable-next-line: no-console
            // console.debug(`Changed from ${State[this._state]} to ${State[state]}`);
            this._state = state;
        }
    }

    public toString() {
        return `State: ${State[this.state]}\nState Variables: ${this.stateVariables.toString()}`;
    }
}

// tslint:disable-next-line: max-classes-per-file
export class StateMachine extends StateMachineBase {
    public getSaveData() {
        return save(this.stateVariables);
    }

    public loadData(data: string, clear: boolean, offset?: number) {
        load(data, this, clear, offset);
    }

    public deleteSelected() {
        delSel(this);
    }

    public copySelected() {
        return save(this.stateVariables, false);
    }

    public execute(action: Action, payload: { target: string, payload: any, event?: PointerEvent }) {
        this.lastAction = action;
        actions[+this.state][+action](this, payload);
    }

    public undo() {
        this.undo_internal(this);
    }

    public redo() {
        this.redo_internal(this);
    }
}
