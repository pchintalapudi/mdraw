import { Transform, registerTransform, State, Action } from "../transitions";
import { RGroup, Bond, element } from "@/models";

// tslint:disable-next-line: no-empty
const mouseDownMoving: Transform = () => { };

const mouseMoveMoving: Transform = (stateMachine, { target, payload }) => {
    const sel = stateMachine.stateVariables.selected;
    const ipos = stateMachine.stateVariables.ipos;
    const xdif = payload.x - ipos[ipos.length - 1].x;
    const ydif = payload.y - ipos[ipos.length - 1].y;
    for (let i = 0; i < sel.length; i++) {
        sel[i].x = ipos[i].x + xdif;
        sel[i].y = ipos[i].y + ydif;
    }
};

const mouseUpMoving: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        const sel = stateMachine.stateVariables.selected;
        const rgs = sel[sel.length - 1];
        const ipos = stateMachine.stateVariables.ipos;
        const dist = Math.hypot(rgs.x - ipos[ipos.length - 1].x, rgs.y - ipos[ipos.length - 1].y);
        if ((Date.now() - 250 < stateMachine.stateVariables.itime && dist < 75) || dist < 25) {
            stateMachine.state = State.PLACING_ATOM_AND_BOND;
            const rg = new RGroup(element(6), rgs.x, rgs.y);
            stateMachine.stateVariables.rgroups.push(rg);
            const bond = new Bond(rgs, rg);
            rgs.bonds.set(rg, bond);
            rg.bonds.set(rgs, bond);
            stateMachine.stateVariables.bonds.push(bond);
            sel.length = 0;
        } else {
            stateMachine.state = State.IDLE;
        }
    }
};

const cancelMoving: Transform = (stateMachine, _) => {
    stateMachine.state = State.IDLE;
    const sel = stateMachine.stateVariables.selected;
    const ipos = stateMachine.stateVariables.ipos;
    for (let i = 0; i < sel.length; i++) {
        sel[i].x = ipos[i].x;
        sel[i].y = ipos[i].y;
    }
};

export default function () {
    registerTransform(State.MOVING_ATOM, Action.MOUSE_DOWN, mouseDownMoving);
    registerTransform(State.MOVING_ATOM, Action.MOUSE_MOVE, mouseMoveMoving);
    registerTransform(State.MOVING_ATOM, Action.MOUSE_UP, mouseUpMoving);
    registerTransform(State.MOVING_ATOM, Action.CANCEL, cancelMoving);
}
