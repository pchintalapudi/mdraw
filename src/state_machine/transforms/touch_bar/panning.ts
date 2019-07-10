import { Transform } from "@/state_machine/transitions";
import { State } from "@/state_machine";

export const panning: Transform = (stateMachine) => {
    stateMachine.state = State.PANNING;
    stateMachine.stateVariables.ipos.length = 0;
    stateMachine.view.viewPort.stopEasing();
};
