import StateVariables from "./state_variables";
import Action from "./actions";

enum State {
    PLACING_ATOM, PLACING_ATOM_AND_BOND, MOVING_ATOM, SELECTING, ROTATING, IDLE, __COUNT__,
}
const actions: any[][] = [];

class StateMachine {

    public stateVariables = new StateVariables();
    private state = State.IDLE;

    public execute(action: Action, payload?: any) {
        actions[+this.state][+action](this, payload);
    }

    public toString() {
        return `State: ${State[this.state]}\nState Variables: ${this.stateVariables.toString()}`;
    }
}

const identity = (stateMachine: StateMachine, action: Action, payload: any) => {
    // tslint:disable-next-line: no-console
    console.warn("Unregistered transformation");
    // tslint:disable-next-line: no-console
    console.log(stateMachine.toString());
    // tslint:disable-next-line: no-console
    console.log(`Action: ${Action[action]}`);
    // tslint:disable-next-line: no-console
    console.log("Payload: ");
    // tslint:disable-next-line: no-console
    console.log(payload);
};

type Transform = typeof identity;

for (let i = 0; i < State.__COUNT__; i++) {
    const arr: any[] = [];
    arr.fill(identity, 0, Action.__COUNT__);
    actions.push(arr);
}

function registerTransform(state: State, action: Action, transform: Transform) {
    if (actions[+state][+action] !== identity) {
        // tslint:disable-next-line: no-console
        console.warn(`Overriding set transform:\nState: ${State[state]}\nAction: ${Action[action]}`);
    }
    actions[+state][+action] = transform;
}

export { State, StateMachine, registerTransform, Transform, StateVariables };
