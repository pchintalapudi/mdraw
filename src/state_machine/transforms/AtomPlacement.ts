import { registerTransform, State, Action, Transform } from "../transitions";

const mouseMoveAtomPlacement: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        const rgs = stateMachine.stateVariables.rgroups;
        const rg = rgs[rgs.length - 1];
        rg.x = payload.x;
        rg.y = payload.y;
    }
};

const mouseUpAtomPlacement: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        mouseMoveAtomPlacement(stateMachine, { target, payload });
        stateMachine.state = State.IDLE;
    }
};

// tslint:disable-next-line: no-empty
const mouseDownAtomPlacement: Transform = () => { };

export default function() {
    registerTransform(State.PLACING_ATOM, Action.MOUSE_MOVE, mouseMoveAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.MOUSE_UP, mouseUpAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.MOUSE_DOWN, mouseDownAtomPlacement);
}
