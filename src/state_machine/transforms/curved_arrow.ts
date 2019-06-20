import { Transform, registerTransform } from "../transitions";
import { StateMachine, State, Action } from "..";
import { CurvedArrow } from "../../models/curvedarrow";

interface Point { readonly x: number; readonly y: number; }

// tslint:disable-next-line: no-empty
const mouseDownPlacingCurvedArrow = () => { };

const mouseMovePlacingCurvedArrow: Transform = (sm, { payload }) => {
    sm.stateVariables.ipos[0].x = payload.x;
    sm.stateVariables.ipos[0].y = payload.y;
};

const mouseUpPlacingCurvedArrow: Transform = (stateMachine, { target, payload }) => {
    mouseMovePlacingCurvedArrow(stateMachine, { target, payload });
    if (target !== "surface") {
        const cas = stateMachine.stateVariables.curvedArrows;
        const ipos = stateMachine.stateVariables.ipos;
        cas.push(new CurvedArrow(payload, ipos[0]));
        stateMachine.state = State.DRAWING_CURVED_ARROW;
    }
};

const cancelPlacingCurvedArrow: Transform = (stateMachine) => {
    stateMachine.stateVariables.ipos.length = 0;
    stateMachine.state = State.IDLE;
};

const mouseMoveDrawingCurvedArrow: Transform = (stateMachine, { target, payload }) => {
    stateMachine.stateVariables.ipos[0].x = payload.x;
    stateMachine.stateVariables.ipos[0].y = payload.y;
};

const mouseUpDrawingCurvedArrow: Transform = (stateMachine, { target, payload }) => {
    mouseMoveDrawingCurvedArrow(stateMachine, { target, payload });
    const cas = stateMachine.stateVariables.curvedArrows;
    if (cas[cas.length - 1].contains(payload)) return;
    if (target !== "surface") {
        const ca = cas[cas.length - 1];
        ca.points[ca.points.length - 1] = payload;
        const undo = (sm: StateMachine) => {
            sm.stateVariables.curvedArrows.pop();
        };
        const redo = (sm: StateMachine) => {
            sm.stateVariables.curvedArrows.push(ca);
        };
        stateMachine.log(undo, redo);
        stateMachine.state = State.IDLE;
    } else {
        cas[cas.length - 1].points.push(stateMachine.stateVariables.ipos[0] = { x: payload.x, y: payload.y });
    }
};

const cancelDrawingCurvedArrow: Transform = (stateMachine) => {
    stateMachine.stateVariables.curvedArrows.pop();
    stateMachine.state = State.IDLE;
};

const buttonCurvedArrow: Transform = (stateMachine, { target, payload }) => {
    stateMachine.execute(Action.CANCEL, undefined as any);
    if (target !== "curved-arrow") stateMachine.execute(Action.BUTTON, { target, payload });
};

export default function () {
    registerTransform(State.PLACING_CURVED_ARROW, Action.MOUSE_DOWN, mouseDownPlacingCurvedArrow);
    registerTransform(State.PLACING_CURVED_ARROW, Action.MOUSE_MOVE, mouseMovePlacingCurvedArrow);
    registerTransform(State.PLACING_CURVED_ARROW, Action.MOUSE_UP, mouseUpPlacingCurvedArrow);
    registerTransform(State.PLACING_CURVED_ARROW, Action.CANCEL, cancelPlacingCurvedArrow);
    registerTransform(State.PLACING_CURVED_ARROW, Action.CLICK, mouseDownPlacingCurvedArrow);
    registerTransform(State.PLACING_CURVED_ARROW, Action.DOUBLE_CLICK, mouseDownPlacingCurvedArrow);
    registerTransform(State.PLACING_CURVED_ARROW, Action.BUTTON, buttonCurvedArrow);
    registerTransform(State.DRAWING_CURVED_ARROW, Action.MOUSE_DOWN, mouseDownPlacingCurvedArrow);
    registerTransform(State.DRAWING_CURVED_ARROW, Action.MOUSE_MOVE, mouseMoveDrawingCurvedArrow);
    registerTransform(State.DRAWING_CURVED_ARROW, Action.MOUSE_UP, mouseUpDrawingCurvedArrow);
    registerTransform(State.DRAWING_CURVED_ARROW, Action.CANCEL, cancelDrawingCurvedArrow);
    registerTransform(State.DRAWING_CURVED_ARROW, Action.CLICK, mouseDownPlacingCurvedArrow);
    registerTransform(State.DRAWING_CURVED_ARROW, Action.DOUBLE_CLICK, mouseDownPlacingCurvedArrow);
    registerTransform(State.DRAWING_CURVED_ARROW, Action.BUTTON, buttonCurvedArrow);
}
