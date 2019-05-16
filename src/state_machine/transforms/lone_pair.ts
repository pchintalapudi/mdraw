import { registerTransform, State, Action, Transform } from "../transitions";
import { RGroup, LonePair } from "@/models";
import calculateAngle from "./angles";

// tslint:disable-next-line: no-empty
const mouseDownPlacingLonePair: Transform = () => { };

const mouseMovePlacingLonePair: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        if (stateMachine.stateVariables.selected.length) {
            stateMachine.stateVariables.selected.pop()!.lonePairs.pop();
        }
        stateMachine.stateVariables.ipos[0].x = payload.x;
        stateMachine.stateVariables.ipos[0].y = payload.y;
    } else if (target === "rgroup" && !stateMachine.stateVariables.selected.length) {
        stateMachine.stateVariables.selected.push(payload);
        const rg = payload as RGroup;
        rg.lonePairs.push(new LonePair(rg, stateMachine.stateVariables.count));
    }
};

const mouseUpPlacingLonePair: Transform = (stateMachine, { target, payload }) => {
    if (target === "rgroup") {
        mouseMovePlacingLonePair(stateMachine, { target, payload });
        stateMachine.state = State.ANGLING_LONE_PAIR;
    }
};

const cancelPlacingLonePair: Transform = (stateMachine) => {
    if (stateMachine.stateVariables.selected.length) {
        stateMachine.stateVariables.selected.pop()!.lonePairs.pop();
    }
    stateMachine.state = State.IDLE;
};

const mouseMoveAnglingLonePair: Transform = (stateMachine, { target, payload }) => {
    const rg = stateMachine.stateVariables.selected[0];
    const lp = rg.lonePairs[rg.lonePairs.length - 1];
    if (target === "surface") {
        lp.angle = stateMachine.stateVariables.lastAngle = calculateAngle(
            Math.hypot(payload.y - rg.y, payload.x - rg.x),
            Math.atan2(payload.y - rg.y, payload.x - rg.x) * 180 / Math.PI);
    } else if (target === "rgroup") {
        lp.angle = Math.atan2(payload.y - rg.y, payload.x - rg.x);
    }
};

const mouseUpAnglingLonePair: Transform = (stateMachine, { target, payload }) => {
    mouseMoveAnglingLonePair(stateMachine, { target, payload });
    const rg = stateMachine.stateVariables.selected.pop()!;
    const lp = rg.lonePairs.pop()!;
    rg.lonePairs.push(lp);
    const undo = () => rg.lonePairs.pop();
    const redo = () => rg.lonePairs.push(lp);
    stateMachine.stateVariables.log(undo, redo);
    stateMachine.state = State.PLACING_LONE_PAIR;
    stateMachine.stateVariables.selected.length = 0;
    stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
    stateMachine.stateVariables.count = lp.count;
};

const buttonPlacingLonePair: Transform = (stateMachine, { target, payload }) => {
    if (target === "lone-pair") {
        if (stateMachine.stateVariables.selected.length) {
            const lps = stateMachine.stateVariables.selected[0].lonePairs;
            lps[lps.length].count = payload;
        }
        stateMachine.stateVariables.count = payload;
    } else if (target === "spawn") {
        if (stateMachine.stateVariables.selected.length) {
            stateMachine.stateVariables.selected[0].lonePairs.pop();
            stateMachine.stateVariables.selected.length = 0;
        }
        stateMachine.state = State.PLACING_ATOM;
        stateMachine.stateVariables.rgroups.push(new RGroup(payload));
    }
};

export default function () {
    registerTransform(State.PLACING_LONE_PAIR, Action.MOUSE_DOWN, mouseDownPlacingLonePair);
    registerTransform(State.PLACING_LONE_PAIR, Action.MOUSE_MOVE, mouseMovePlacingLonePair);
    registerTransform(State.PLACING_LONE_PAIR, Action.MOUSE_UP, mouseUpPlacingLonePair);
    registerTransform(State.PLACING_LONE_PAIR, Action.CANCEL, cancelPlacingLonePair);
    registerTransform(State.ANGLING_LONE_PAIR, Action.MOUSE_DOWN, mouseDownPlacingLonePair);
    registerTransform(State.ANGLING_LONE_PAIR, Action.MOUSE_MOVE, mouseMoveAnglingLonePair);
    registerTransform(State.ANGLING_LONE_PAIR, Action.MOUSE_UP, mouseUpAnglingLonePair);
    registerTransform(State.ANGLING_LONE_PAIR, Action.CANCEL, cancelPlacingLonePair);
    registerTransform(State.PLACING_LONE_PAIR, Action.BUTTON, buttonPlacingLonePair);
    registerTransform(State.ANGLING_LONE_PAIR, Action.BUTTON, buttonPlacingLonePair);
}
