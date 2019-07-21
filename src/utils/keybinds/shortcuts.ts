import { registerKeybind, getValidator, Consumer } from "./registration";
import { Action } from "@/state_machine";

function key(k: string, consumer: Consumer) {
    registerKeybind(k, getValidator(), consumer);
}

const spawnAtom: Consumer = (vmdata) => vmdata.stateMachine.execute(Action.BUTTON,
    { target: "spawn", payload: vmdata.stateMachine.stateVariables.cache.lastElement });

const toggleD3: Consumer = (vmdata) => {
    vmdata.omit = false;
    vmdata.d3 = !vmdata.d3;
};

const toggleOmit: Consumer = (vmdata) => vmdata.omit = !vmdata.d3 && !vmdata.omit;

function target(t: string) {
    return { target: t, payload: undefined };
}

const infer: Consumer = (vmdata) => vmdata.stateMachine.execute(Action.BUTTON, target("infer"));

const straightArrow: Consumer = (vmdata) => vmdata.stateMachine.execute(Action.BUTTON, target("straight-arrow"));

const curvedArrow: Consumer = (vmdata) => vmdata.stateMachine.execute(Action.BUTTON, target("curved-arrow"));

const lonePair: Consumer = (vmdata) => vmdata.stateMachine.execute(Action.BUTTON, { target: "lone-pair", payload: 2 });

const mapping: Consumer = (vmdata) => vmdata.stateMachine.execute(Action.BUTTON, target("mapping"));

const panning: Consumer = (vmdata) => vmdata.stateMachine.execute(Action.BUTTON, target("panning"));

export default function () {
    key(" ", spawnAtom);
    key("d", toggleD3);
    key("o", toggleOmit);
    key("i", infer);
    key("s", straightArrow);
    key("c", curvedArrow);
    key("l", lonePair);
    key("m", mapping);
    key("p", panning);
}
