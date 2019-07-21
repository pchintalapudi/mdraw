import { Transform } from "@/state_machine/transitions";
import { State } from "@/state_machine";
import { RGroup } from "@/models";

export const spawn: Transform = (stateMachine, { payload }) => {
    stateMachine.state = State.PLACING_ATOM;
    stateMachine.stateVariables.rgroups.push(new RGroup(payload));
    stateMachine.stateVariables.cache.lastElement = payload;
};
