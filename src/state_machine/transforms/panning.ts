import { State, Action, StateMachine } from "..";
import { Transform, registerTransform } from "../transitions";

const mouseDownPanning: Transform = (stateMachine, { event }) => {
    stateMachine.stateVariables.ipos = [{ x: stateMachine.view.viewPort.startX, y: stateMachine.view.viewPort.startY },
    { x: event!.x, y: event!.y }];
};

const mouseMovePanning: Transform = (stateMachine, { event }) => {
    if (stateMachine.stateVariables.ipos.length) {
        const sv = stateMachine.stateVariables;
        stateMachine.view.viewPort.startX = Math.min(Math.max(sv.ipos[0].x - event!.x + sv.ipos[1].x,
            stateMachine.view.viewBox.startX),
            stateMachine.view.viewBox.endX - stateMachine.view.viewPort.width);
        stateMachine.view.viewPort.startY = Math.min(Math.max(sv.ipos[0].y - event!.y + sv.ipos[1].y,
            stateMachine.view.viewBox.startY),
            stateMachine.view.viewBox.endY - stateMachine.view.viewPort.height);
    }
};

const mouseUpPanning: Transform = (stateMachine, { target, payload, event }) => {
    mouseMovePanning(stateMachine, { target, payload, event });
    stateMachine.stateVariables.ipos = [];
};

const cancelPanning: Transform = (stateMachine) => {
    if (stateMachine.stateVariables.ipos.length) {
        stateMachine.view.viewPort.startX = stateMachine.stateVariables.ipos[0].x;
        stateMachine.view.viewPort.startY = stateMachine.stateVariables.ipos[0].y;
    }
    stateMachine.state = State.IDLE;
};

const buttonPanning: Transform = (stateMachine, { target, payload }) => {
    stateMachine.execute(Action.CANCEL, undefined as any);
    if (target !== "panning") {
        stateMachine.execute(Action.BUTTON, { target, payload });
    }
};

// tslint:disable-next-line: no-empty
const nullfunction = () => { };

export default function () {
    registerTransform(State.PANNING, Action.MOUSE_DOWN, mouseDownPanning);
    registerTransform(State.PANNING, Action.MOUSE_MOVE, mouseMovePanning);
    registerTransform(State.PANNING, Action.MOUSE_UP, mouseUpPanning);
    registerTransform(State.PANNING, Action.CANCEL, cancelPanning);
    registerTransform(State.PANNING, Action.BUTTON, buttonPanning);
    registerTransform(State.PANNING, Action.CLICK, nullfunction);
    registerTransform(State.PANNING, Action.DOUBLE_CLICK, nullfunction);
}
