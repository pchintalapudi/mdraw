import { State, Action, Transform, StateMachine, registerTransform } from "../transitions";

const mouseDownIdle: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        stateMachine.state = State.SELECTING;
        const sbox = stateMachine.stateVariables.selectionBox;
        payload = payload as PointerEvent;
        sbox.x = payload.x;
        sbox.y = payload.y;
        sbox.width = 0;
        sbox.height = 0;
    }
};

function select(stateMachine: StateMachine) {
    const sbox = stateMachine.stateVariables.selectionBox;
    stateMachine.stateVariables.selected = stateMachine.stateVariables.rgroups.filter(r => sbox.contains(r));
}

const mouseMoveSelecting: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        const sbox = stateMachine.stateVariables.selectionBox;
        payload = payload as PointerEvent;
        sbox.ex = payload.x;
        sbox.ey = payload.y;
        select(stateMachine);
    }
};

const mouseUpSelecting: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        mouseMoveSelecting(stateMachine, { target, payload });
        mouseDownIdle(stateMachine, { target, payload });
        stateMachine.state = State.IDLE;
    }
};

// tslint:disable-next-line: no-empty
const mouseMoveIdle: Transform = () => { };
// tslint:disable-next-line: no-empty
const mouseUpIdle: Transform = () => { };

export default () => {
    registerTransform(State.IDLE, Action.MOUSE_DOWN, mouseDownIdle);
    registerTransform(State.SELECTING, Action.MOUSE_MOVE, mouseMoveSelecting);
    registerTransform(State.SELECTING, Action.MOUSE_UP, mouseUpSelecting);
    registerTransform(State.IDLE, Action.MOUSE_MOVE, mouseMoveIdle);
    registerTransform(State.IDLE, Action.MOUSE_UP, mouseUpIdle);
};
