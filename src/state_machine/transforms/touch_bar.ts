import { Transform, registerTransform, State, Action } from "../transitions";
import { RGroup } from "@/models";

const handleButton: Transform = (stateMachine, { target, payload }) => {
    if (target === "spawn") {
        stateMachine.state = State.PLACING_ATOM;
        stateMachine.stateVariables.rgroups.push(new RGroup(payload));
    } else if (target === "lone-pair") {
        stateMachine.state = State.PLACING_LONE_PAIR;
        stateMachine.stateVariables.selected.length = 0;
        stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
        stateMachine.stateVariables.count = payload;
    }
};

export default function () { registerTransform(State.IDLE, Action.BUTTON, handleButton); }
