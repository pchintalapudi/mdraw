import { Transform, registerTransform } from "../transitions";
import { State, Action, StateMachine } from "..";
import { Rectangle } from "@/utils";

const mouseDownIdle: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        stateMachine.state = State.SELECTING;
        const sbox = stateMachine.stateVariables.selection.selectionBox;
        sbox.x = payload.x;
        sbox.y = payload.y;
        sbox.width = 0;
        sbox.height = 0;
    } else if (target === "rgroup") {
        stateMachine.stateVariables.temp.number = stateMachine.stateVariables.selection.selected.has(payload) ? 1 : 0;
        stateMachine.stateVariables.temp.point = payload;
        stateMachine.stateVariables.temp.counterPoint = { x: payload.x, y: payload.y };
        Array.from(stateMachine.stateVariables.selection.selected.keys())
            .forEach(rs => stateMachine.stateVariables.selection.selected.set(rs, { x: rs.x, y: rs.y }));
        stateMachine.stateVariables.temp.time = Date.now();
        stateMachine.state = State.MOVING_ATOM;
    } else if (target === "bond") {
        stateMachine.stateVariables.temp.number = -1;
    }
};

function contains(sbox: Rectangle, point: { x: number, y: number }) {
    return point.x >= sbox.left && point.x <= sbox.right && point.y >= sbox.top && point.y <= sbox.bottom;
}

function select(stateMachine: StateMachine) {
    const selected = stateMachine.stateVariables.selection.selected;
    const sbox = stateMachine.stateVariables.selection.selectionBox;
    selected.clear();
    stateMachine.stateVariables.rgroups.forEach(r => {
        if (contains(sbox, r)) selected.set(r, { x: r.x, y: r.y });
    });
    stateMachine.stateVariables.straightArrows.forEach(s => {
        if (contains(sbox, s)) selected.set(s, { x: s.x, y: s.y });
    });
}

const mouseMoveSelecting: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface" || target === "rgroup") {
        const sbox = stateMachine.stateVariables.selection.selectionBox;
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
    stateMachine.stateVariables.selection.selected.clear();
    stateMachine.state = State.IDLE;
};

const buttonSelecting: Transform = (stateMachine, payload) => {
    stateMachine.execute(Action.CANCEL, undefined as any);
    stateMachine.execute(Action.BUTTON, payload);
};

// tslint:disable-next-line: no-empty
const mouseMoveIdle: Transform = () => { };

export default function () {
    registerTransform(State.SELECTING, Action.MOUSE_DOWN, mouseMoveIdle);
    registerTransform(State.SELECTING, Action.MOUSE_MOVE, mouseMoveSelecting);
    registerTransform(State.SELECTING, Action.MOUSE_UP, mouseUpSelecting);
    registerTransform(State.SELECTING, Action.CANCEL, cancelIdle);
    registerTransform(State.SELECTING, Action.BUTTON, buttonSelecting);
    registerTransform(State.IDLE, Action.MOUSE_DOWN, mouseDownIdle);
    registerTransform(State.IDLE, Action.MOUSE_MOVE, mouseMoveIdle);
    registerTransform(State.IDLE, Action.MOUSE_UP, mouseMoveIdle);
    registerTransform(State.IDLE, Action.CANCEL, cancelIdle);
}
