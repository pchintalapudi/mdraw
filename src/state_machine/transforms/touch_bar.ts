import { Transform, registerTransform } from "../transitions";
import { RGroup, Bond, LonePair } from "@/models";
import { State, Action, StateMachine } from "..";
import { infer } from "@/infer";

const handleButton: Transform = (stateMachine, { target, payload }) => {
    switch (target) {
        case "spawn":
            stateMachine.state = State.PLACING_ATOM;
            stateMachine.stateVariables.rgroups.push(new RGroup(payload));
            break;
        case "lone-pair":
            stateMachine.state = State.PLACING_LONE_PAIR;
            stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
            stateMachine.stateVariables.count = payload;
            break;
        case "straight-arrow":
            stateMachine.state = State.PLACING_STRAIGHT_ARROW;
            stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
            break;
        case "curved-arrow":
            stateMachine.state = State.PLACING_CURVED_ARROW;
            stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
            break;
        case "panning":
            stateMachine.state = State.PANNING;
            stateMachine.stateVariables.ipos.length = 0;
            stateMachine.view.viewPort.stopEasing();
            break;
        case "mapping":
            stateMachine.state = State.MAPPING;
            stateMachine.stateVariables.ipos.length = 0;
            stateMachine.view.viewPort.stopEasing();
            break;
        case "infer":
            stateMachine.stateVariables.selected.length = 0;
            const addedRGroups = [] as RGroup[];
            const addedBonds = [] as Bond[];
            const addedLonePairs = [] as LonePair[];
            const dcharges = new Map<RGroup, number>();
            stateMachine.stateVariables.rgroups.forEach(r => {
                const add = infer(r);
                addedRGroups.push(...add[0]);
                addedBonds.push(...add[0].map(h => h.bonds.get(r)!));
                addedLonePairs.push(...add[1]);
                dcharges.set(r, add[2]);
            });
            const oldRGLength = stateMachine.stateVariables.rgroups.length;
            const oldBondLength = stateMachine.stateVariables.bonds.length;
            stateMachine.stateVariables.rgroups.push(...addedRGroups);
            stateMachine.stateVariables.bonds.push(...addedBonds);
            const undo = (sm: StateMachine) => {
                sm.stateVariables.rgroups.splice(oldRGLength, addedRGroups.length);
                sm.stateVariables.bonds.splice(oldBondLength, addedBonds.length);
                addedBonds.forEach(b => b.start.bonds.delete(b.end));
                addedLonePairs.forEach(lp => lp.rgroup.lonePairs.pop());
                dcharges.forEach((c, r) => r.charge -= c);
            };
            const redo = (sm: StateMachine) => {
                sm.stateVariables.rgroups.push(...addedRGroups);
                sm.stateVariables.bonds.push(...addedBonds);
                addedBonds.forEach(b => b.start.bonds.set(b.end, b));
                addedLonePairs.forEach(lp => lp.rgroup.lonePairs.push(lp));
                dcharges.forEach((c, r) => r.charge += c);
            };
            stateMachine.log(undo, redo);
    }
};

export default function () { registerTransform(State.IDLE, Action.BUTTON, handleButton); }
