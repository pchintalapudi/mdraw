import StateVariables from "./state_variables";
import Action from "./actions";

enum State {
    PLACING_ATOM, PLACING_ATOM_AND_BOND, MOVING_ATOM, SELECTING, ROTATING, IDLE, __COUNT__,
}
const actions: Transform[][] = [];

class StateMachine {

    public stateVariables = new StateVariables();
    public lastAction = Action.__COUNT__;
    // tslint:disable-next-line: variable-name
    private _state = State.IDLE;

    get state() {
        return this._state;
    }

    set state(state: State) {
        if (this._state !== state) {
            // tslint:disable-next-line: no-console
            console.debug(`Changed from ${State[this._state]} to ${State[state]}`);
            this._state = state;
        }
    }

    public execute(action: Action, payload: { target: string, payload: any }) {
        this.lastAction = action;
        actions[+this.state][+action](this, payload);
    }

    public toString() {
        return `State: ${State[this.state]}\nState Variables: ${this.stateVariables.toString()}`;
    }
}

function identity(stateMachine: StateMachine, payload: { target: string, payload: any }) {
    // tslint:disable-next-line: no-console
    console.warn("Unregistered transformation");
    // tslint:disable-next-line: no-console
    console.log(stateMachine.toString());
    // tslint:disable-next-line: no-console
    console.log(`Action: ${Action[stateMachine.lastAction]}`);
    // tslint:disable-next-line: no-console
    console.log("Payload: ");
    // tslint:disable-next-line: no-console
    console.log(payload);
}

type Transform = typeof identity;

for (let i = 0; i < State.__COUNT__; i++) {
    const arr: any[] = [];
    for (let j = 0; j < Action.__COUNT__; j++) {
        arr.push(identity);
    }
    actions.push(arr);
}

function registerTransform(state: State, action: Action, transform: Transform) {
    if (actions[+state][+action] !== identity) {
        // tslint:disable-next-line: no-console
        console.warn(`Overriding set transform:\nState: ${State[state]}\nAction: ${Action[action]}`);
    } else {
        // tslint:disable-next-line: no-console
        console.debug(`Set ${State[state]} ${Action[action]}`);
    }
    actions[+state][+action] = transform;
}

export { State, StateMachine, Action, registerTransform, Transform, StateVariables };
