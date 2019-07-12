import { registerKeybind, getValidator, Consumer } from "./registration";
import { Action } from "@/state_machine";
import { Modifier } from "./modifiers";

const cancel: Consumer = (vmdata) => vmdata.stateMachine.execute(Action.CANCEL, undefined as any);

const undo: Consumer = (vmdata) => vmdata.stateMachine.undo();

const redo: Consumer = (vmdata) => vmdata.stateMachine.redo();

export default function () {
    registerKeybind("Escape", getValidator(), cancel);
    registerKeybind("z", getValidator(Modifier.SHORTCUT), undo);
    registerKeybind("Z", getValidator(Modifier.SHORTCUT, Modifier.SHIFT), redo);
    registerKeybind("y", getValidator(Modifier.SHORTCUT), redo);
}
