import { Transform, registerTransform, State, Action, StateMachine } from "../transitions";
import { RGroup, Bond, element } from "@/models";

// tslint:disable-next-line: no-empty
const mouseDownMoving: Transform = () => { };

const mouseMoveMoving: Transform = (stateMachine, { payload }) => {
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
    const sel = stateMachine.stateVariables.selected;
    const rgs = sel[sel.length - 1];
    const ipos = stateMachine.stateVariables.ipos;
    const dist = Math.hypot(rgs.x - ipos[ipos.length - 1].x, rgs.y - ipos[ipos.length - 1].y);
    if ((Date.now() - 250 < stateMachine.stateVariables.itime && dist < 75) || dist < 15) {
        cancelMoving(stateMachine, undefined as any);
        if (rgs instanceof RGroup) {
            stateMachine.state = State.PLACING_ATOM_AND_BOND;
            const rg = new RGroup(element(6), rgs.x, rgs.y);
            stateMachine.stateVariables.rgroups.push(rg);
            const bond = new Bond(rgs, rg);
            rgs.bonds.set(rg, bond);
            rg.bonds.set(rgs, bond);
            stateMachine.stateVariables.bonds.push(bond);
            sel.length = 0;
        }
    } else {
        if (target === "surface") {
            const initialPositions = [...ipos];
            const finalPositions = sel.map(r => ({ x: r.x, y: r.y }));
            const moved = [...sel];
            const undo = (_: StateMachine) => {
                for (let i = 0; i < moved.length; i++) {
                    moved[i].x = initialPositions[i].x;
                    moved[i].y = initialPositions[i].y;
                }
            };
            const redo = (_: StateMachine) => {
                for (let i = 0; i < moved.length; i++) {
                    moved[i].x = finalPositions[i].x;
                    moved[i].y = finalPositions[i].y;
                }
            };
            stateMachine.stateVariables.log(undo, redo);
            if (sel.length === 1) {
                sel.length = 0;
            }
            stateMachine.state = State.IDLE;
        } else if (target === "rgroup" && rgs instanceof RGroup) {
            // Merging
            mouseMoveMoving(stateMachine, { target, payload });
            const initialPositions = [...ipos];
            const finalPositions = sel.map(r => ({ x: r.x, y: r.y }));
            const moved = [...sel];
            const idx = stateMachine.stateVariables.rgroups.indexOf(rgs);
            const oldPayload = payload.payload;
            if (rgs.payload !== element(6)) {
                payload.payload = rgs.payload;
            }
            const newPayload = payload.payload;
            const remove = new Map<Bond, number>();
            rgs.bonds.forEach((b, r) => {
                r.bonds.delete(rgs);
                if (!payload.bonds.has(r)) {
                    b.replace(rgs, payload);
                    payload.bonds.set(r, b);
                    r.bonds.set(payload, b);
                } else {
                    remove.set(b, -1);
                }
            });
            for (let i = 0; i < stateMachine.stateVariables.bonds.length; i++) {
                const bond = stateMachine.stateVariables.bonds[i];
                const m1 = remove.get(bond);
                if (m1) {
                    remove.set(bond, i);
                }
            }
            payload.lonePairs.push(...rgs.lonePairs);
            const undo = (sm: StateMachine) => {
                sm.stateVariables.rgroups.splice(idx, 0, rgs);
                payload.payload = oldPayload;
                const newbonds: Bond[] | undefined = [];
                newbonds.length = sm.stateVariables.bonds.length + remove.size;
                rgs.bonds.forEach((b, r) => {
                    r.bonds.set(rgs, b);
                    if (!remove.has(b)) {
                        b.replace(payload, rgs);
                        payload.bonds.delete(r);
                        r.bonds.delete(payload);
                    } else {
                        newbonds[remove.get(b)!] = b;
                    }
                });
                let j = -1;
                for (const bond of sm.stateVariables.bonds) {
                    // tslint:disable-next-line: curly
                    while (newbonds[++j]);
                    newbonds[j] = bond;
                }
                sm.stateVariables.bonds.length = 0;
                sm.stateVariables.bonds.push(...newbonds);
                for (let i = 0; i < moved.length; i++) {
                    moved[i].x = initialPositions[i].x;
                    moved[i].y = initialPositions[i].y;
                }
                payload.lonePairs.length -= rgs.lonePairs.length;
            };
            const redo = (sm: StateMachine) => {
                sm.stateVariables.rgroups.splice(idx, 1);
                payload.payload = newPayload;
                rgs.bonds.forEach((b, r) => {
                    r.bonds.delete(rgs);
                    if (!remove.has(b)) {
                        b.replace(rgs, payload);
                        payload.bonds.set(r, b);
                        r.bonds.set(payload, b);
                    } else {
                        sm.stateVariables.bonds = sm.stateVariables.bonds.filter(bond => !remove.has(bond));
                    }
                });
                for (let i = 0; i < moved.length; i++) {
                    moved[i].x = finalPositions[i].x;
                    moved[i].y = finalPositions[i].y;
                }
                payload.lonePairs.push(...rgs.lonePairs);
            };
            stateMachine.stateVariables.log(undo, redo);
            stateMachine.stateVariables.rgroups.splice(idx, 1);
            stateMachine.stateVariables.bonds = stateMachine.stateVariables.bonds.filter(b => !remove.has(b));
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
