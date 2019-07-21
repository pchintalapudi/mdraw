import { registerTransform, Transform } from "../transitions";
import { Bond, BondState } from "@/models";
import { State, Action, StateMachine } from "..";

const bondClick: Transform = (stateMachine, { target, payload }) => {
    if (target === "bond" && stateMachine.stateVariables.temp.number === -1) {
        const bond = payload as Bond;
        const oldState = bond.state;
        let newState: BondState;
        switch (oldState) {
            case BondState.FORWARD:
                newState = BondState.RETREATING;
                break;
            case BondState.RETREATING:
                newState = BondState.THICK;
                break;
            case BondState.THICK:
                newState = BondState.SINGLE;
                break;
            case BondState.SINGLE:
                newState = BondState.FORWARD;
                break;
            case BondState.DOUBLE:
                newState = BondState.DOUBLE_LEFT;
                break;
            case BondState.DOUBLE_LEFT:
                newState = BondState.DOUBLE_RIGHT;
                break;
            case BondState.DOUBLE_RIGHT:
                newState = BondState.DOUBLE;
                break;
            case BondState.TRIPLE:
                newState = BondState.TRIPLE_SHORT;
                break;
            case BondState.TRIPLE_SHORT:
                newState = BondState.TRIPLE;
                break;
            default:
                newState = BondState.PARTIAL;
                break;
        }
        const undo = (_: StateMachine) => { bond.state = oldState; };
        const redo = (_: StateMachine) => { bond.state = newState; };
        stateMachine.log(undo, redo);
        bond.state = newState;
    }
    stateMachine.stateVariables.temp.number = 0;
};

const bondDoubleClick: Transform = (stateMachine, { target, payload }) => {
    if (target === "bond") {
        const bond = payload as Bond;
        const oldState = bond.state;
        let newState: BondState;
        switch (oldState) {
            case BondState.SINGLE:
            case BondState.RETREATING:
            case BondState.FORWARD:
            case BondState.THICK:
                newState = BondState.DOUBLE;
                break;
            case BondState.DOUBLE:
            case BondState.DOUBLE_LEFT:
            case BondState.DOUBLE_RIGHT:
                newState = BondState.TRIPLE;
                break;
            case BondState.TRIPLE:
            case BondState.TRIPLE_SHORT:
                newState = BondState.PARTIAL;
                break;
            case BondState.PARTIAL:
            default:
                newState = BondState.SINGLE;
                break;
        }
        const undo = (_: StateMachine) => { bond.state = oldState; };
        const redo = (_: StateMachine) => { bond.state = newState; };
        stateMachine.log(undo, redo);
        bond.state = newState;
    }
};

export default function () {
    registerTransform(State.IDLE, Action.CLICK, bondClick);
    registerTransform(State.IDLE, Action.DOUBLE_CLICK, bondDoubleClick);
}
