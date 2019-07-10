import { StateMachine, Action } from "..";
import { RGroup, Bond, LonePair, StraightArrow, CurvedArrow } from "@/models";

export function load(data: string, stateMachine: StateMachine, clear: boolean, offset?: number) {
    offset = offset || 0;
    if (!data) return;
    const groups = data.split("!").map(s => s.split(",").filter(str => str));
    const entityMap = new Map<number, RGroup | Bond | LonePair>();
    const rgroups: RGroup[] = [];
    for (const r of groups[0].map(RGroup.deserialize)) {
        entityMap.set(r[0], r[1]);
        r[2].forEach(v => entityMap.set(v[0], v[1]));
        r[1].x += offset;
        r[1].y += offset;
        rgroups.push(r[1]);
    }
    const bonds: Bond[] = [];
    for (const b of groups[1].map(s => Bond.deserialize(s, entityMap as Map<number, RGroup>))) {
        bonds.push(b[1]);
        entityMap.set(b[0], b[1]);
    }
    const straightArrows: StraightArrow[] = groups[2].map(StraightArrow.deserialize);
    straightArrows.forEach(s => {
        s.x += offset!;
        s.y += offset!;
    });
    const curvedArrows: CurvedArrow[] = groups[3].map(s => CurvedArrow.deserialize(s, entityMap));
    curvedArrows.forEach(c => {
        c.points.slice(1, c.points.length - 1).forEach(p => {
            (p as any).x += offset!;
            (p as any).y += offset!;
        });
    });
    stateMachine.execute(Action.CANCEL, undefined as any);
    const copy = stateMachine.stateVariables.getCopy(0b1111) as [RGroup[], Bond[], StraightArrow[], CurvedArrow[]];
    if (clear) {
        const undo = (sm: StateMachine) => {
            sm.stateVariables.setEntities(...copy);
        };
        const redo = (sm: StateMachine) => {
            sm.stateVariables.setEntities(rgroups, bonds, straightArrows, curvedArrows);
        };
        stateMachine.log(undo, redo);
        redo(stateMachine);
    } else {
        const undo = (sm: StateMachine) => {
            sm.stateVariables.rgroups.splice(copy[0].length, rgroups.length);
            sm.stateVariables.bonds.splice(copy[1].length, bonds.length);
            sm.stateVariables.straightArrows.splice(copy[2].length, straightArrows.length);
            sm.stateVariables.curvedArrows.splice(copy[3].length, curvedArrows.length);
        };
        const redo = (sm: StateMachine) => {
            sm.stateVariables.rgroups.push(...rgroups);
            sm.stateVariables.bonds.push(...bonds);
            sm.stateVariables.straightArrows.push(...straightArrows);
            sm.stateVariables.curvedArrows.push(...curvedArrows);
        };
        stateMachine.stateVariables.selected = [...rgroups, ...straightArrows];
        stateMachine.log(undo, redo);
        redo(stateMachine);
    }
}
