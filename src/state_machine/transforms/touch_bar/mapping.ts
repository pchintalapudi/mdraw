import { Transform } from "@/state_machine/transitions";
import { State } from "@/state_machine";

export const mapping: Transform = (stateMachine) => {
    stateMachine.state = State.MAPPING;
    stateMachine.stateVariables.ipos.length = 0;
    stateMachine.view.viewPort.stopEasing();
};
