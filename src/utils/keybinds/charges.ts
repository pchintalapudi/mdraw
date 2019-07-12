import { registerKeybind, getValidator, Consumer } from "./registration";
import { RGroup } from "@/models";
const increment: Consumer = (vmdata) => vmdata.stateMachine.stateVariables.selected
    .filter(r => r instanceof RGroup).forEach(r => (r as RGroup).charge++);
const decrement: Consumer = (vmdata) => vmdata.stateMachine.stateVariables.selected
    .filter(r => r instanceof RGroup).forEach(r => (r as RGroup).charge--);

export default function () {
    registerKeybind("+", getValidator(), increment);
    registerKeybind("-", getValidator(), decrement);
}
