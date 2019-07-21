import { registerKeybind, getValidator, Consumer } from "./registration";
import { RGroup } from "@/models";
import { Modifier } from './modifiers';
const increment: Consumer = (vmdata) => Array.from(vmdata.stateMachine.stateVariables.selection.selected.keys())
    .filter(r => r instanceof RGroup).forEach(r => (r as RGroup).charge++);
const decrement: Consumer = (vmdata) => Array.from(vmdata.stateMachine.stateVariables.selection.selected.keys())
    .filter(r => r instanceof RGroup).forEach(r => (r as RGroup).charge--);

export default function () {
    registerKeybind("+", getValidator(), increment);
    registerKeybind("-", getValidator(), increment);
    registerKeybind("+", getValidator(Modifier.SHIFT), increment);
    registerKeybind("-", getValidator(Modifier.SHIFT), decrement);
}
