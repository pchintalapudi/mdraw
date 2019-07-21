import { Transform } from "@/state_machine/transitions";
import { State } from "@/state_machine";

export const straightArrow: Transform = (stateMachine) => {
    stateMachine.state = State.PLACING_STRAIGHT_ARROW;
    stateMachine.stateVariables.temp.point = { x: 0, y: 0 };
};
