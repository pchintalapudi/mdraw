import { data } from "../drawer";
import { keybind } from "./registration";
export * from "./modifiers";

export function keyHandler(evt: KeyboardEvent, vmdata: ReturnType<typeof data>) {
    const handlers = keybind.get(evt.key);
    if (handlers) {
        const valid = handlers.filter(v => v[0](evt));
        if (valid.length) {
            valid.forEach(v => v[1](vmdata, evt));
            evt.preventDefault();
        }
    }
}

import charges from "./charges";
import copypaste from "./copypaste";
import history from "./history";
import io from "./io";
import shortcuts from "./shortcuts";

export function init_keybinds() {
    charges();
    copypaste();
    history();
    io();
    shortcuts();
}
