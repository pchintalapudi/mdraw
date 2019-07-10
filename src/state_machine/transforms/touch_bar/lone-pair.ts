import { Transform } from "@/state_machine/transitions";
import { State } from "@/state_machine";

export const lonePair: Transform = (stateMachine, { payload }) => {
    stateMachine.state = State.PLACING_LONE_PAIR;
    stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
    stateMachine.stateVariables.count = payload;
};
