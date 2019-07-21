import { registerKeybind, Consumer, getValidator } from "./registration";
import { Modifier } from "./modifiers";
import { Action } from "@/state_machine";

const copy: Consumer = (vmdata) => { vmdata.clipboard = vmdata.stateMachine.copySelected(); vmdata.copyOffset = 0; };

const del: Consumer = (vmdata) => vmdata.stateMachine.deleteSelected();

const cut: Consumer = (vmdata, ev) => copy(vmdata, ev) as any && false || del(vmdata, ev);

const paste: Consumer = (vmdata) => vmdata.stateMachine.loadData(vmdata.clipboard, false, vmdata.copyOffset += 10);

const highlightAll: Consumer = ({ stateMachine }) => {
    stateMachine.execute(Action.CANCEL, undefined as any);
    const selected = stateMachine.stateVariables.selection.selected;
    stateMachine.stateVariables.rgroups.forEach(rg => selected.set(rg, { x: rg.x, y: rg.y }));
    stateMachine.stateVariables.straightArrows.forEach(sa => selected.set(sa, { x: sa.x, y: sa.y }));
};

export default function () {
    const shortcut = getValidator(Modifier.SHORTCUT);
    registerKeybind("c", shortcut, copy);
    registerKeybind("x", shortcut, cut);
    registerKeybind("v", shortcut, paste);
    registerKeybind("a", shortcut, highlightAll);
    registerKeybind("Backspace", getValidator(), del);
    registerKeybind("Delete", getValidator(), del);
}
