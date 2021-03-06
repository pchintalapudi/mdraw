import { registerTransform, Transform } from "../transitions";
import { State, Action, StateMachine } from "..";
import { StraightArrow } from "@/models";
import calculateAngle from "./angles";

// tslint:disable-next-line: no-empty
const mouseDownPlacingStraightArrow = () => { };

const mouseMovePlacingStraightArrow: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        stateMachine.stateVariables.temp.point = payload;
    }
};

const mouseUpPlacingStraightArrow: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        stateMachine.stateVariables.straightArrows.push(
            new StraightArrow(payload, 0, 0));
        stateMachine.state = State.ANGLING_STRAIGHT_ARROW;
    }
};

const cancelPlacingStraightArrow: Transform = (stateMachine) => {
    stateMachine.state = State.IDLE;
};

const mouseMoveAnglingStraightArrow: Transform = (stateMachine, { target, payload }) => {
    const sas = stateMachine.stateVariables.straightArrows;
    const sa = sas[sas.length - 1];
    if (target === "surface") {
        sa.dist = Math.hypot(payload.y - sa.start.y, payload.x - sa.start.x);
        sa.angle = stateMachine.stateVariables.cache.lastAngle = calculateAngle(
            sa.dist, Math.atan2(payload.y - sa.start.y, payload.x - sa.start.x) * 180 / Math.PI);
    }
};

const mouseUpAnglingStraightArrow: Transform = (stateMachine, { target, payload }) => {
    if (target === "surface") {
        mouseMoveAnglingStraightArrow(stateMachine, { target, payload });
        const sa = stateMachine.stateVariables.straightArrows.pop()!;
        const undo = (sm: StateMachine) => {
            sm.stateVariables.straightArrows.pop();
        };
        const redo = (sm: StateMachine) => {
            sm.stateVariables.straightArrows.push(sa);
        };
        stateMachine.log(undo, redo);
        stateMachine.stateVariables.straightArrows.push(sa);
        stateMachine.state = State.IDLE;
    }
};

const cancelAnglingStraightArrow: Transform = (stateMachine) => {
    stateMachine.stateVariables.straightArrows.pop();
    stateMachine.state = State.IDLE;
};

export default function () {
    registerTransform(State.PLACING_STRAIGHT_ARROW, Action.MOUSE_DOWN, mouseDownPlacingStraightArrow);
    registerTransform(State.PLACING_STRAIGHT_ARROW, Action.MOUSE_MOVE, mouseMovePlacingStraightArrow);
    registerTransform(State.PLACING_STRAIGHT_ARROW, Action.MOUSE_UP, mouseUpPlacingStraightArrow);
    registerTransform(State.PLACING_STRAIGHT_ARROW, Action.CANCEL, cancelPlacingStraightArrow);
    registerTransform(State.ANGLING_STRAIGHT_ARROW, Action.MOUSE_DOWN, mouseDownPlacingStraightArrow);
    registerTransform(State.ANGLING_STRAIGHT_ARROW, Action.MOUSE_MOVE, mouseMoveAnglingStraightArrow);
    registerTransform(State.ANGLING_STRAIGHT_ARROW, Action.MOUSE_UP, mouseUpAnglingStraightArrow);
    registerTransform(State.ANGLING_STRAIGHT_ARROW, Action.CANCEL, cancelAnglingStraightArrow);
}
