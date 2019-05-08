import { Transform, registerTransform, State, Action } from "../transitions";
import { RGroup } from "@/models";

const handleButton: Transform = (stateMachine, { target, payload }) => {
    if (target === "spawn") {
        stateMachine.state = State.PLACING_ATOM;
        stateMachine.stateVariables.rgroups.push(new RGroup(payload));
    }
};

export default function () { registerTransform(State.IDLE, Action.BUTTON, handleButton); }
