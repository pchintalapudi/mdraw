import { spawn } from "./spawn";
import { lonePair } from "./lone-pair";
import { straightArrow } from "./straight-arrow";
import { curvedArrow } from "./curved-arrow";
import { panning } from "./panning";
import { mapping } from "./mapping";
import { inferImplicits } from "./infer";
import { Transform, registerTransform } from "@/state_machine/transitions";
import { State, Action } from "@/state_machine";

function pair(f: Transform): [string, Transform] {
    return [f.name, f];
}

const targeter = new Map<string, Transform>([
    spawn, lonePair, straightArrow, curvedArrow, panning, mapping, inferImplicits].map(pair));

const touchBar: Transform = (stateMachine, payload) => {
    targeter.get(payload.target)!(stateMachine, payload);
};


export default function () { registerTransform(State.IDLE, Action.BUTTON, touchBar); }
