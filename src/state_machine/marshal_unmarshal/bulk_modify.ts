import { RGroup, StraightArrow, Bond, CurvedArrow } from "@/models";
import { StateMachine } from "../state_machine";

export function deleteSelected(stateMachine: StateMachine) {
    const rgroups: Set<RGroup> = new Set();
    const straightArrows: Set<StraightArrow> = new Set();
    for (const selected of stateMachine.stateVariables.selected) {
        (selected instanceof RGroup ? rgroups : straightArrows).add(selected as any);
    }
    const bonds: Set<Bond> = new Set();
    rgroups.forEach(r => r.bonds.forEach(b => bonds.add(b)));
    const curvedArrows: Set<CurvedArrow> = new Set();
    for (const c of stateMachine.stateVariables.curvedArrows) {
        search:
        for (const set of [rgroups, bonds]) {
            for (const e of Array.from(set as any) as RGroup[] | Bond[]) {
                if (c.contains(e)) {
                    curvedArrows.add(c);
                    break search;
                }
            }
        }
    }
    const newRGroups = stateMachine.stateVariables.rgroups.filter(r => !rgroups.has(r));
    const newStraightArrows = stateMachine.stateVariables.straightArrows.filter(s => !straightArrows.has(s));
    const newBonds = stateMachine.stateVariables.bonds.filter(b => !bonds.has(b));
    const newCurvedArrows = stateMachine.stateVariables.curvedArrows.filter(c => !curvedArrows.has(c));
    const oldRGroups = [...stateMachine.stateVariables.rgroups];
    const oldStraightArrows = [...stateMachine.stateVariables.straightArrows];
    const oldBonds = [...stateMachine.stateVariables.bonds];
    const oldCurvedArrows = [...stateMachine.stateVariables.curvedArrows];
    const undo = (sm: StateMachine) => {
        sm.stateVariables.rgroups = oldRGroups;
        sm.stateVariables.bonds = oldBonds;
        sm.stateVariables.straightArrows = oldStraightArrows;
        sm.stateVariables.curvedArrows = oldCurvedArrows;
    };
    const redo = (sm: StateMachine) => {
        sm.stateVariables.rgroups = newRGroups;
        sm.stateVariables.bonds = newBonds;
        sm.stateVariables.straightArrows = newStraightArrows;
        sm.stateVariables.curvedArrows = newCurvedArrows;
    };
    stateMachine.log(undo, redo);
    redo(stateMachine);
}
