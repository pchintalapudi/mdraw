import { Transform } from "@/state_machine/transitions";
import { State } from "@/state_machine";

export const curvedArrow: Transform = (stateMachine) => {
    stateMachine.state = State.PLACING_CURVED_ARROW;
    stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
};
