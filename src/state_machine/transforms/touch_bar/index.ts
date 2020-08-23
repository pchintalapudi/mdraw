import { spawn } from "./spawn";
import { lonePair } from "./lone-pair";
import { straightArrow } from "./straight-arrow";
import { curvedArrow } from "./curved-arrow";
import { panning } from "./panning";
import { mapping } from "./mapping";
import { infer } from "./infer";
import { Transform, registerTransform } from "@/state_machine/transitions";
import { State, Action } from "@/state_machine";

const targeter = new Map<string, Transform>([
    ["spawn", spawn], ["lone-pair", lonePair], ["straight-arrow", straightArrow], ["curved-arrow", curvedArrow], ["panning", panning], ["mapping", mapping], ["infer", infer]]);

const touchBar: Transform = (stateMachine, payload) => {
    if (targeter.has(payload.target)) targeter.get(payload.target)!(stateMachine, payload);
    else {
        // tslint:disable-next-line: no-console
        console.warn(`Tried to call nonexistent function ${payload.target}`);
    }
};


export default function () { registerTransform(State.IDLE, Action.BUTTON, touchBar); }
