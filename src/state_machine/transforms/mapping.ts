import { State, StateMachine, Action } from "..";
import { Transform, registerTransform } from "../transitions";

const mouseDownMapping: Transform = (stateMachine, payload) => {
    if (!stateMachine.stateVariables.count++) {
        stateMachine.stateVariables.ipos =
            [{ x: stateMachine.view.viewPort.startX, y: stateMachine.view.viewPort.startY }];
    }
    mouseMoveMapping(stateMachine, payload);
};

const mouseMoveMapping: Transform = (stateMachine, { payload }) => {
    if (stateMachine.stateVariables.count) {
        const view = stateMachine.view;
        const x = payload.x - view.viewPort.width / 2;
        const y = payload.y - view.viewPort.height / 2;
        view.viewPort.startX = Math.max(view.viewBox.startX, Math.min(view.viewBox.endX - view.viewPort.width, x));
        view.viewPort.startY = Math.max(view.viewBox.startY, Math.min(view.viewBox.endY - view.viewPort.height, y));
    }
};

const mouseUpMapping: Transform = (stateMachine, payload) => {
    mouseMoveMapping(stateMachine, payload);
    if (!--stateMachine.stateVariables.count) {
        stateMachine.stateVariables.ipos = [];
    }
};

const cancelMapping: Transform = (stateMachine) => {
    if (stateMachine.stateVariables.count) {
        stateMachine.stateVariables.count = 0;
        stateMachine.view.viewPort.startX = stateMachine.stateVariables.ipos[0].x;
        stateMachine.view.viewPort.startY = stateMachine.stateVariables.ipos[0].y;
    }
    stateMachine.state = State.IDLE;
};

export default function () {
    registerTransform(State.MAPPING, Action.MOUSE_DOWN, mouseDownMapping);
    registerTransform(State.MAPPING, Action.MOUSE_MOVE, mouseMoveMapping);
    registerTransform(State.MAPPING, Action.MOUSE_UP, mouseUpMapping);
    registerTransform(State.MAPPING, Action.CANCEL, cancelMapping);
}
