import { Transform } from "@/state_machine/transitions";
import { StateMachine } from "@/state_machine";
import { infer } from "@/infer";
import { RGroup, Bond, LonePair } from "@/models";

export const inferImplicits: Transform = (stateMachine, { payload }) => {
    stateMachine.stateVariables.selected.length = 0;
    const addedRGroups = [] as RGroup[];
    const addedBonds = [] as Bond[];
    const addedLonePairs = [] as LonePair[];
    const dcharges = new Map<RGroup, number>();
    const affected = stateMachine.stateVariables.selected.length
        ? stateMachine.stateVariables.selected.filter(r => r instanceof RGroup) as RGroup[]
        : stateMachine.stateVariables.rgroups;
    affected.forEach(r => {
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
        sm.stateVariables.rgroups.length = oldRGLength;
        sm.stateVariables.bonds.length = oldBondLength;
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
};
