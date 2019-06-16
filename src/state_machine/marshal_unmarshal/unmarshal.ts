import { StateMachine, Action } from "..";
import { RGroup, Bond, LonePair, StraightArrow, CurvedArrow } from "@/models";

export function load(data: string, stateMachine: StateMachine, clear: boolean) {
    const groups = data.split("!").filter(s => s).map(s => s.split(",").filter(str => str));
    const entityMap = new Map<number, RGroup | Bond | LonePair>();
    const rgroups: RGroup[] = [];
    for (const r of groups[0].map(RGroup.deserialize)) {
        entityMap.set(r[0], r[1]);
        r[2].forEach(v => entityMap.set(v[0], v[1]));
        rgroups.push(r[1]);
    }
    const bonds: Bond[] = [];
    for (const b of groups[1].map(s => Bond.deserialize(s, entityMap as Map<number, RGroup>))) {
        bonds.push(b[1]);
        entityMap.set(b[0], b[1]);
    }
    const straightArrows: StraightArrow[] = groups[2].map(StraightArrow.deserialize);
    const curvedArrows: CurvedArrow[] = groups[3].map(s => CurvedArrow.deserialize(s, entityMap));
    stateMachine.execute(Action.CANCEL, undefined as any);
    const copy = stateMachine.stateVariables.getCopy(0b1111) as [RGroup[], Bond[], StraightArrow[], CurvedArrow[]];
    const vars = stateMachine.stateVariables;
    if (clear) {
        const undo = () => {
            vars.setEntities(...copy);
        };
        const redo = () => {
            vars.setEntities(rgroups, bonds, straightArrows, curvedArrows);
        };
        stateMachine.log(undo, redo);
        redo();
    } else {
        const undo = () => {
            vars.rgroups.splice(copy[0].length, rgroups.length);
            vars.bonds.splice(copy[1].length, bonds.length);
            vars.straightArrows.splice(copy[2].length, straightArrows.length);
            vars.curvedArrows.splice(copy[3].length, curvedArrows.length);
        };
        const redo = () => {
            vars.rgroups.push(...rgroups);
            vars.bonds.push(...bonds);
            vars.straightArrows.push(...straightArrows);
            vars.curvedArrows.push(...curvedArrows);
        };
        stateMachine.log(undo, redo);
        redo();
    }
}
