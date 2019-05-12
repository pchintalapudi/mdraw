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
    } else if (target === "rgroup") {
        const idx = stateMachine.stateVariables.selected.indexOf(payload);
        if (idx === -1) {
            stateMachine.stateVariables.selected.length = 0;
        } else {
            stateMachine.stateVariables.selected.splice(idx, 1);
        }
        stateMachine.stateVariables.selected.push(payload);
        stateMachine.stateVariables.ipos.length = 0;
        stateMachine.stateVariables.ipos.push(
            ...stateMachine.stateVariables.selected.map(r => ({ x: r.x, y: r.y }))
        );
        stateMachine.stateVariables.itime = Date.now();
        stateMachine.state = State.MOVING_ATOM;
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

const cancelIdle: Transform = (stateMachine, { }) => {
    stateMachine.stateVariables.selected.length = 0;
};

// tslint:disable-next-line: no-empty
const mouseMoveIdle: Transform = () => { };

export default () => {
    registerTransform(State.SELECTING, Action.MOUSE_DOWN, mouseMoveIdle);
    registerTransform(State.SELECTING, Action.MOUSE_MOVE, mouseMoveSelecting);
    registerTransform(State.SELECTING, Action.MOUSE_UP, mouseUpSelecting);
    registerTransform(State.SELECTING, Action.CANCEL, cancelIdle);
    registerTransform(State.IDLE, Action.MOUSE_DOWN, mouseDownIdle);
    registerTransform(State.IDLE, Action.MOUSE_MOVE, mouseMoveIdle);
    registerTransform(State.IDLE, Action.MOUSE_UP, mouseMoveIdle);
    registerTransform(State.IDLE, Action.CANCEL, cancelIdle);
};
