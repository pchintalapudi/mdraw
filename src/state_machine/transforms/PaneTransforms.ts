import { State, Action, Transform, StateMachine, registerTransform } from "../transitions";
import { RGroup, Bond, element } from "@/models";

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

const cancelIdle: Transform = (stateMachine, { }) => {
    stateMachine.stateVariables.selected.length = 0;
};

// tslint:disable-next-line: no-empty
const mouseMoveIdle: Transform = () => { };

const mouseUpIdle: Transform = (stateMachine, { target, payload }) => {
    if (target === "rgroup") {
        stateMachine.state = State.PLACING_ATOM_AND_BOND;
        payload = payload as RGroup;
        const rg = new RGroup(element(6), payload.x, payload.y);
        stateMachine.stateVariables.rgroups.push(rg);
        const bond = new Bond(payload, rg);
        payload.bonds.set(rg, bond);
        rg.bonds.set(payload, bond);
        stateMachine.stateVariables.bonds.push(bond);
    }
};

export default () => {
    registerTransform(State.SELECTING, Action.MOUSE_MOVE, mouseMoveSelecting);
    registerTransform(State.SELECTING, Action.MOUSE_UP, mouseUpSelecting);
    registerTransform(State.SELECTING, Action.CANCEL, cancelIdle);
    registerTransform(State.IDLE, Action.MOUSE_DOWN, mouseDownIdle);
    registerTransform(State.IDLE, Action.MOUSE_MOVE, mouseMoveIdle);
    registerTransform(State.IDLE, Action.MOUSE_UP, mouseUpIdle);
    registerTransform(State.IDLE, Action.CANCEL, cancelIdle);
};
