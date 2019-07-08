import { Transform, registerTransform } from "../transitions";
import { RGroup } from "@/models";
import { State, Action } from "..";
import { infer } from "@/infer";

const handleButton: Transform = (stateMachine, { target, payload }) => {
    switch (target) {
        case "spawn":
            stateMachine.state = State.PLACING_ATOM;
            stateMachine.stateVariables.rgroups.push(new RGroup(payload));
            break;
        case "lone-pair":
            stateMachine.state = State.PLACING_LONE_PAIR;
            stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
            stateMachine.stateVariables.count = payload;
            break;
        case "straight-arrow":
            stateMachine.state = State.PLACING_STRAIGHT_ARROW;
            stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
            break;
        case "curved-arrow":
            stateMachine.state = State.PLACING_CURVED_ARROW;
            stateMachine.stateVariables.ipos = [{ x: 0, y: 0 }];
            break;
        case "panning":
            stateMachine.state = State.PANNING;
            stateMachine.stateVariables.ipos.length = 0;
            stateMachine.view.viewPort.stopEasing();
            break;
        case "mapping":
            stateMachine.state = State.MAPPING;
            stateMachine.stateVariables.ipos.length = 0;
            stateMachine.view.viewPort.stopEasing();
            break;
        case "infer":
            stateMachine.stateVariables.selected.length = 0;
            stateMachine.stateVariables.rgroups.forEach(r => {
                const add = infer(r);
                stateMachine.stateVariables.rgroups.push(...add[0]);
                stateMachine.stateVariables.bonds.push(...add[0].map(h => h.bonds.get(r)!));
            });
    }
};

export default function () { registerTransform(State.IDLE, Action.BUTTON, handleButton); }
