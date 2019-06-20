import { registerTransform, Transform } from "../transitions";
import calculateAngle from "./angles";
import { Constants } from "@/utils";
import { RGroup, Bond, element } from "@/models";
import { State, Action, StateMachine } from "..";

const buttonAtomPlacement: Transform = (stateMachine, { target, payload }) => {
    if (target === "spawn") {
        const rgs = stateMachine.stateVariables.rgroups;
        rgs[rgs.length - 1].payload = payload;
    } else {
        stateMachine.execute(Action.CANCEL, undefined as any);
        stateMachine.execute(Action.BUTTON, { target, payload });
    }
};

const mouseMoveAtomPlacement: Transform = (stateMachine, { target, payload }) => {
    const rgs = stateMachine.stateVariables.rgroups;
    const rg = rgs[rgs.length - 1];
    rg.x = payload.x;
    rg.y = payload.y;
};

const mouseUpAtomPlacement: Transform = (stateMachine, { target, payload }) => {
    const rgs = stateMachine.stateVariables.rgroups;
    const rg = rgs[rgs.length - 1];
    if (target === "surface") {
        mouseMoveAtomPlacement(stateMachine, { target, payload });
        const undo = (sm: StateMachine) => sm.stateVariables.rgroups.pop();
        const redo = (sm: StateMachine) => sm.stateVariables.rgroups.push(rg);
        stateMachine.log(undo, redo);
        stateMachine.state = State.IDLE;
    } else if (target === "rgroup") {
        const oldPayload = payload.payload;
        payload.payload = rg.payload;
        rgs.pop();
        const undo = (_: StateMachine) => payload.payload = oldPayload;
        const redo = (_: StateMachine) => payload.payload = oldPayload;
        stateMachine.log(undo, redo);
        stateMachine.state = State.IDLE;
        stateMachine.execute(Action.BUTTON, { target: "spawn", payload: payload.payload });
    }
};

const cancelAtomPlacement: Transform = (stateMachine, _) => {
    stateMachine.stateVariables.rgroups.pop();
    stateMachine.state = State.IDLE;
};

// tslint:disable-next-line: no-empty
const mouseDownAtomPlacement: Transform = () => { };

const buttonBondPlacement: Transform = (stateMachine, { target, payload }) => {
    if (target === "spawn") {
        buttonAtomPlacement(stateMachine, { target, payload });
    }
};

const mouseMoveBondPlacement: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        const rgs = stateMachine.stateVariables.rgroups;
        const rg = rgs[rgs.length - 1];
        const bonds = stateMachine.stateVariables.bonds;
        const start = bonds[bonds.length - 1].start;
        stateMachine.stateVariables.lastAngle = calculateAngle(Math.hypot(payload.y - start.y, payload.x - start.x),
            Math.atan2(payload.y - start.y, payload.x - start.x) * 180 / Math.PI,
            stateMachine.stateVariables.lastPlaced);
        rg.x = Constants.bondLength * Math.cos(Math.PI / 180 * stateMachine.stateVariables.lastAngle) + start.x;
        rg.y = Constants.bondLength * Math.sin(Math.PI / 180 * stateMachine.stateVariables.lastAngle) + start.y;
    } else if (target === "rgroup") {
        const bonds = stateMachine.stateVariables.bonds;
        const start = bonds[bonds.length - 1].start;
        if (start !== payload) {
            mouseMoveAtomPlacement(stateMachine, { target, payload });
            stateMachine.stateVariables.lastAngle =
                Math.atan2(payload.y - start.y, payload.x - start.x) * 180 / Math.PI;
        }
    }
};

const mouseUpBondPlacement: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        const rgs = stateMachine.stateVariables.rgroups;
        const rgc = rgs[rgs.length - 1];
        const bs = stateMachine.stateVariables.bonds;
        const b = bs[bs.length - 1];
        mouseMoveBondPlacement(stateMachine, { target, payload });
        const prevPlaced = stateMachine.stateVariables.lastPlaced;
        const lastPlaced = stateMachine.stateVariables.lastPlaced = (stateMachine.stateVariables.lastAngle + 720) % 360;
        const undo = (sm: StateMachine) => {
            sm.stateVariables.rgroups.pop();
            sm.stateVariables.bonds.pop();
            bond.start.bonds.delete(rgc);
            sm.stateVariables.lastPlaced = prevPlaced;
        };
        const redo = (sm: StateMachine) => {
            sm.stateVariables.rgroups.push(rgc);
            sm.stateVariables.bonds.push(b);
            bond.start.bonds.set(rgc, b);
            sm.stateVariables.lastPlaced = lastPlaced;
        };
        stateMachine.log(undo, redo);
        const rg = new RGroup(element(6), rgc.x, rgc.y);
        stateMachine.stateVariables.rgroups.push(rg);
        const bond = new Bond(rgc, rg);
        rgc.bonds.set(rg, bond);
        rg.bonds.set(rgc, bond);
        stateMachine.stateVariables.bonds.push(bond);
    } else if (target === "rgroup") {
        const rg = stateMachine.stateVariables.rgroups.pop()!;
        const bond = rg.bonds.values().next().value;
        if (payload !== bond.start && !bond.start.bonds.has(payload)) {
            bond.end = payload;
            bond.start.bonds.delete(rg);
            bond.start.bonds.set(payload, bond);
            payload.bonds.set(bond.start, bond);
            const oldPayload = payload.payload;
            if (rg.payload !== element(6)) {
                payload.payload = rg.payload;
            }
            const newPayload = payload.payload;
            const lastPlaced = stateMachine.stateVariables.lastPlaced;
            const undo = (sm: StateMachine) => {
                sm.stateVariables.bonds.pop();
                bond.start.bonds.delete(payload);
                payload.bonds.delete(bond.start);
                payload.payload = oldPayload;
                sm.stateVariables.lastPlaced = lastPlaced;
            };
            const redo = (sm: StateMachine) => {
                sm.stateVariables.bonds.push(bond);
                bond.start.bonds.set(payload, bond);
                payload.bonds.set(bond.start, bond);
                payload.payload = newPayload;
                sm.stateVariables.lastPlaced = 0;
            };
            stateMachine.log(undo, redo);
            stateMachine.state = State.IDLE;
            stateMachine.stateVariables.lastPlaced = 0;
        } else {
            stateMachine.stateVariables.rgroups.push(rg);
        }
    }
};

const cancelBondPlacement: Transform = (stateMachine, _) => {
    stateMachine.stateVariables.bonds.pop()!.start.bonds.delete(stateMachine.stateVariables.rgroups.pop()!);
    stateMachine.state = State.IDLE;
    stateMachine.stateVariables.lastAngle = 0;
    stateMachine.stateVariables.lastPlaced = 0;
};

export default function () {
    registerTransform(State.PLACING_ATOM, Action.MOUSE_MOVE, mouseMoveAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.MOUSE_UP, mouseUpAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.MOUSE_DOWN, mouseDownAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.CANCEL, cancelAtomPlacement);
    registerTransform(State.PLACING_ATOM, Action.BUTTON, buttonAtomPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.MOUSE_MOVE, mouseMoveBondPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.MOUSE_DOWN, mouseDownAtomPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.MOUSE_UP, mouseUpBondPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.CANCEL, cancelBondPlacement);
    registerTransform(State.PLACING_ATOM_AND_BOND, Action.BUTTON, buttonBondPlacement);
}
