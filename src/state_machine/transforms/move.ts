import { Transform, registerTransform } from "../transitions";
import { RGroup, Bond, StraightArrow } from "@/models";
import { State, Action, StateMachine } from "..";
import { Constants } from "@/utils";

interface Point { x: number; y: number; }

// tslint:disable-next-line: no-empty
const mouseDownMoving: Transform = () => { };

const mouseMoveMoving: Transform = (stateMachine, { payload }) => {
    const point = stateMachine.stateVariables.temp.counterPoint;
    const xdif = payload.x - point.x, ydif = payload.y - point.y;
    if (stateMachine.stateVariables.temp.number) {
        stateMachine.stateVariables.selection.selected.forEach((p, rs) => {
            rs.x = p.x + xdif;
            rs.y = p.y + ydif;
        });
    }
    stateMachine.stateVariables.temp.point.x = payload.x;
    stateMachine.stateVariables.temp.point.y = payload.y;
};

const mouseUpMoving: Transform = (stateMachine, { target, payload }) => {
    const rgs = stateMachine.stateVariables.temp.point;
    const point = stateMachine.stateVariables.temp.counterPoint;
    const dist = Math.hypot(rgs.x - point.x, rgs.y - point.y);
    if (Date.now() - Constants.clickTime < stateMachine.stateVariables.temp.time && dist < 75) {
        cancelMoving(stateMachine, undefined as any);
        if (rgs instanceof RGroup) {
            stateMachine.state = State.PLACING_ATOM_AND_BOND;
            const rg = new RGroup(stateMachine.stateVariables.cache.lastElement, rgs.x, rgs.y);
            stateMachine.stateVariables.rgroups.push(rg);
            const bond = new Bond(rgs, rg);
            rgs.bonds.set(rg, bond);
            rg.bonds.set(rgs, bond);
            stateMachine.stateVariables.bonds.push(bond);
        }
    } else {
        if (target === "surface") {
            if (stateMachine.stateVariables.temp.number) {
                const moved = new Map<RGroup | StraightArrow, { initial: Point, final: Point }>();
                stateMachine.stateVariables.selection.selected.forEach((p, rs) => {
                    moved.set(rs, { initial: p, final: { x: rs.x, y: rs.y } });
                });
                if (dist > 5) {
                    const undo = () => {
                        moved.forEach(({ initial }, rs) => {
                            rs.x = initial.x;
                            rs.y = initial.y;
                        });
                    };
                    const redo = () => {
                        moved.forEach(({ final }, rs) => {
                            rs.x = final.x;
                            rs.y = final.y;
                        });
                    };
                    stateMachine.log(undo, redo);
                } else {
                    moved.forEach(({ initial }, rs) => {
                        rs.x = initial.x;
                        rs.y = initial.y;
                    });
                }
            } else {
                if (dist > 5) {
                    const final = { x: rgs.x, y: rgs.y };
                    const undo = () => {
                        rgs.x = point.x;
                        rgs.y = point.y;
                    };
                    const redo = () => {
                        rgs.x = final.x;
                        rgs.y = final.y;
                    };
                    stateMachine.log(undo, redo);
                } else {
                    rgs.x = point.x;
                    rgs.y = point.y;
                }
            }
            stateMachine.state = State.IDLE;
        } else if (target === "rgroup" && rgs instanceof RGroup) {
            // Merging
            mouseMoveMoving(stateMachine, { target, payload });
            const moved = new Map<RGroup | StraightArrow, { initial: Point, final: Point }>();
            stateMachine.stateVariables.selection.selected.forEach((p, rs) => {
                moved.set(rs, { initial: p, final: { x: rs.x, y: rs.y } });
            });
            const idx = stateMachine.stateVariables.rgroups.indexOf(rgs);
            const oldPayload = payload.payload;
            if (rgs.payload.name !== "Carbon") {
                payload.payload = rgs.payload;
            }
            const newPayload = payload.payload;
            const remove = new Set<Bond>();
            rgs.bonds.forEach((b, r) => {
                r.bonds.delete(rgs);
                if (!payload.bonds.has(r)) {
                    b.replace(rgs, payload);
                    payload.bonds.set(r, b);
                    r.bonds.set(payload, b);
                } else {
                    remove.add(b);
                }
            });
            const oldBonds = [...stateMachine.stateVariables.bonds];
            const newBonds = oldBonds.filter(b => !remove.has(b));
            payload.lonePairs.push(...rgs.lonePairs);
            const undo = (sm: StateMachine) => {
                sm.stateVariables.rgroups.splice(idx, 0, rgs);
                payload.payload = oldPayload;
                rgs.bonds.forEach((b, r) => {
                    r.bonds.set(rgs, b);
                    if (!remove.has(b)) {
                        b.replace(payload, rgs);
                        payload.bonds.delete(r);
                        r.bonds.delete(payload);
                    }
                });
                sm.stateVariables.bonds.splice(0, newBonds.length, ...oldBonds);
                moved.forEach(({ initial }, rs) => {
                    rs.x = initial.x;
                    rs.y = initial.y;
                });
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
                    }
                });
                sm.stateVariables.bonds.splice(0, oldBonds.length, ...newBonds);
                moved.forEach(({ final }, rs) => {
                    rs.x = final.x;
                    rs.y = final.y;
                });
                payload.lonePairs.push(...rgs.lonePairs);
            };
            stateMachine.log(undo, redo);
            stateMachine.stateVariables.rgroups.splice(idx, 1);
            stateMachine.stateVariables.bonds.splice(0, oldBonds.length, ...newBonds);
            stateMachine.state = State.IDLE;
        }
    }
};

const cancelMoving: Transform = (stateMachine, _) => {
    stateMachine.state = State.IDLE;
    if (stateMachine.stateVariables.temp.number) {
        stateMachine.stateVariables.selection.selected.forEach((p, rs) => {
            rs.x = p.x;
            rs.y = p.y;
        });
    } else {
        stateMachine.stateVariables.temp.point.x = stateMachine.stateVariables.temp.counterPoint.x;
        stateMachine.stateVariables.temp.point.y = stateMachine.stateVariables.temp.counterPoint.y;
    }
};

export default function () {
    registerTransform(State.MOVING_ATOM, Action.MOUSE_DOWN, mouseDownMoving);
    registerTransform(State.MOVING_ATOM, Action.MOUSE_MOVE, mouseMoveMoving);
    registerTransform(State.MOVING_ATOM, Action.MOUSE_UP, mouseUpMoving);
    registerTransform(State.MOVING_ATOM, Action.CANCEL, cancelMoving);
}
