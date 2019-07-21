import { Transform } from "@/state_machine/transitions";
import { State } from "@/state_machine";

export const lonePair: Transform = (stateMachine, { payload }) => {
    stateMachine.state = State.PLACING_LONE_PAIR;
    stateMachine.stateVariables.temp.point = { x: 0, y: 0 };
    stateMachine.stateVariables.temp.number = payload;
    stateMachine.stateVariables.temp.number2 = 0;
};
