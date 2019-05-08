import { registerTransform, State, Action, Transform } from "../transitions";
import calculateAngle from "./angles";
import { Constants } from "@/utils";

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

const mouseMoveBondPlacement: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        const rg = stateMachine.stateVariables.creating;
        const start = rg.bonds.values().next().value.peer(rg);
        stateMachine.stateVariables.lastAngle = calculateAngle(Constants.bondLength,
            Math.atan2(payload.y - start.y, payload.x - start.x) * 180 / Math.PI,
            stateMachine.stateVariables.lastPlaced);
        rg.x = Constants.bondLength * Math.cos(Math.PI / 180 * stateMachine.stateVariables.lastAngle) + start.x;
        rg.y = Constants.bondLength * Math.sin(Math.PI / 180 * stateMachine.stateVariables.lastAngle) + start.y;
    } else if (target === "rgroup") {
        mouseMoveAtomPlacement(stateMachine, { target, payload });
    }
};

const mouseUpBondPlacement: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        mouseMoveBondPlacement(stateMachine, { target, payload });
        stateMachine.stateVariables.lastPlaced = stateMachine.stateVariables.lastAngle;
        stateMachine.state = State.IDLE;
    } else if (target === "rgroup") {
        mouseDownAtomPlacement(stateMachine, { target, payload });
        stateMachine.stateVariables.lastPlaced = 0;
    }
};

export default function () {
    registerTransform(State.PLACING_ATOM, Action.MOUSE_MOVE, mouseMoveAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.MOUSE_UP, mouseUpAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.MOUSE_DOWN, mouseDownAtomPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.MOUSE_MOVE, mouseMoveBondPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.MOUSE_DOWN, mouseDownAtomPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.MOUSE_UP, mouseUpBondPlacement);
}
