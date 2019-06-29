import { Transform, registerTransform } from "../transitions";
import { RGroup } from "@/models";
import { State, Action } from "..";

const handleButton: Transform = (stateMachine, { target, payload }) => {
    if (target === "spawn") {
        stateMachine.state = State.PLACING_ATOM;
        stateMachine.stateVariables.rgroups.push(new RGroup(payload));
    } else if (target === "lone-pair") {
        stateMachine.state = State.PLACING_LONE_PAIR;
        stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
        stateMachine.stateVariables.count = payload;
    } else if (target === "straight-arrow") {
        stateMachine.state = State.PLACING_STRAIGHT_ARROW;
        stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
    } else if (target === "curved-arrow") {
        stateMachine.state = State.PLACING_CURVED_ARROW;
        stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
    } else if (target === "panning") {
        stateMachine.state = State.PANNING;
        stateMachine.stateVariables.ipos.length = 0;
    }
};

export default function () { registerTransform(State.IDLE, Action.BUTTON, handleButton); }
