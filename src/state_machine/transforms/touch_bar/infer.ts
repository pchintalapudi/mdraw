import { Transform } from "@/state_machine/transitions";
import { StateMachine } from "@/state_machine";
import { infer as inferImplicits } from "@/infer";
import { RGroup, Bond, LonePair } from "@/models";

export const infer: Transform = (stateMachine) => {
    const addedRGroups = [] as RGroup[];
    const addedBonds = [] as Bond[];
    const addedLonePairs = [] as LonePair[];
    const dcharges = new Map<RGroup, number>();
    const affected = [] as RGroup[];
    const stateVariables = stateMachine.stateVariables;
    if (stateVariables.selection.selected.size) {
        stateVariables.selection.selected.forEach((_, r) => r instanceof RGroup && affected.push(r));
    } else {
        affected.push(...stateVariables.rgroups);
    }
    affected.forEach(r => {
        const add = inferImplicits(r);
        addedRGroups.push(...add[0]);
        addedBonds.push(...add[0].map(h => h.bonds.get(r)!));
        addedLonePairs.push(...add[1]);
        dcharges.set(r, add[2]);
    });
    const oldRGLength = stateVariables.rgroups.length;
    const oldBondLength = stateVariables.bonds.length;
    stateVariables.rgroups.push(...addedRGroups);
    stateVariables.bonds.push(...addedBonds);
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
};
