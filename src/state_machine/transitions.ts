import StateVariables from "./state_variables";
import Action from "./actions";
import State from "./state";
import { StateMachine } from "./index";
const actions: Transform[][] = [];

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

export { registerTransform, Transform, actions };
