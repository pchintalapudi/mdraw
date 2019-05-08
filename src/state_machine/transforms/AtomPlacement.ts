import { registerTransform, State, Action, Transform } from "../transitions";

const mouseMoveAtomPlacement: Transform = (stateMachine, { target, payload }) => {
    const rgs = stateMachine.stateVariables.rgroups;
    const rg = rgs[rgs.length - 1];
    if (target === "surface" || target === "rgroup") {
        rg.x = payload.x;
        rg.y = payload.y;
    }
};

const mouseUpAtomPlacement: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        mouseMoveAtomPlacement(stateMachine, { target, payload });
        stateMachine.state = State.IDLE;
    } else if (target === "rgroup") {
        const rgs = stateMachine.stateVariables.rgroups;
        const rg = rgs[rgs.length - 1];
        payload.payload = rg.payload;
        rgs.pop();
        stateMachine.state = State.IDLE;
    }
};

// tslint:disable-next-line: no-empty
const mouseDownAtomPlacement: Transform = () => { };

export default function () {
    registerTransform(State.PLACING_ATOM, Action.MOUSE_MOVE, mouseMoveAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.MOUSE_UP, mouseUpAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.MOUSE_DOWN, mouseDownAtomPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.MOUSE_MOVE, mouseMoveAtomPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.MOUSE_DOWN, mouseDownAtomPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.MOUSE_UP, mouseUpAtomPlacement);
}
