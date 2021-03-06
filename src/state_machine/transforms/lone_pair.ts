import { registerTransform, Transform } from "../transitions";
import { RGroup, LonePair } from "@/models";
import calculateAngle from "./angles";
import { State, Action } from "..";

// tslint:disable-next-line: no-empty
const mouseDownPlacingLonePair: Transform = () => { };

const mouseMovePlacingLonePair: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        if (stateMachine.stateVariables.temp.number2) {
            stateMachine.stateVariables.temp.number2 = 0;
            (stateMachine.stateVariables.temp.point as RGroup).lonePairs.pop();
        }
        stateMachine.stateVariables.temp.point = payload;
    } else if (target === "rgroup" && !stateMachine.stateVariables.temp.number2) {
        stateMachine.stateVariables.temp.number2 = 1;
        stateMachine.stateVariables.temp.point = payload;
        const rg = payload as RGroup;
        rg.lonePairs.push(new LonePair(rg, stateMachine.stateVariables.temp.number));
    }
};

const mouseUpPlacingLonePair: Transform = (stateMachine, { target, payload }) => {
    if (target === "rgroup") {
        mouseMovePlacingLonePair(stateMachine, { target, payload });
        stateMachine.state = State.ANGLING_LONE_PAIR;
    }
};

const cancelPlacingLonePair: Transform = (stateMachine) => {
    if (stateMachine.stateVariables.temp.number2) {
        (stateMachine.stateVariables.temp.point as RGroup).lonePairs.pop();
    }
    stateMachine.state = State.IDLE;
};

const mouseMoveAnglingLonePair: Transform = (stateMachine, { target, payload }) => {
    const rg = stateMachine.stateVariables.temp.point as RGroup;
    const lp = rg.lonePairs[rg.lonePairs.length - 1];
    if (target === "surface") {
        lp.angle = stateMachine.stateVariables.cache.lastAngle = calculateAngle(
            Math.hypot(payload.y - rg.y, payload.x - rg.x),
            Math.atan2(payload.y - rg.y, payload.x - rg.x) * 180 / Math.PI);
    } else if (target === "rgroup") {
        lp.angle = Math.atan2(payload.y - rg.y, payload.x - rg.x) * 180 / Math.PI;
    }
};

const mouseUpAnglingLonePair: Transform = (stateMachine, { target, payload }) => {
    mouseMoveAnglingLonePair(stateMachine, { target, payload });
    const rg = stateMachine.stateVariables.temp.point as RGroup;
    const lp = rg.lonePairs.pop()!;
    rg.lonePairs.push(lp);
    const undo = () => rg.lonePairs.pop();
    const redo = () => rg.lonePairs.push(lp);
    stateMachine.log(undo, redo);
    stateMachine.state = State.PLACING_LONE_PAIR;
};

const buttonPlacingLonePair: Transform = (stateMachine, { target, payload }) => {
    if (target === "lone-pair") {
        if (stateMachine.stateVariables.temp.number2) {
            const lps = (stateMachine.stateVariables.temp.point as RGroup).lonePairs;
            const lp = lps[lps.length - 1];
            if (lp.count === payload) {
                stateMachine.execute(Action.CANCEL, undefined as any);
                return;
            } else {
                lps[lps.length].count = payload;
            }
        }
        stateMachine.stateVariables.temp.number = payload;
    } else {
        stateMachine.execute(Action.CANCEL, undefined as any);
        stateMachine.execute(Action.BUTTON, { target, payload });
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
