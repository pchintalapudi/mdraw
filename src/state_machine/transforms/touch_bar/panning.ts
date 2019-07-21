import { Transform } from "@/state_machine/transitions";
import { State } from "@/state_machine";

export const panning: Transform = (stateMachine) => {
    stateMachine.stateVariables.temp.number = 0;
    stateMachine.state = State.PANNING;
};
