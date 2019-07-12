import { registerKeybind, Consumer, getValidator } from "./registration";
import { Modifier } from "./modifiers";

const copy: Consumer = (vmdata) => { vmdata.clipboard = vmdata.stateMachine.copySelected(); vmdata.copyOffset = 0; };

const del: Consumer = (vmdata) => vmdata.stateMachine.deleteSelected();

const cut: Consumer = (vmdata, ev) => copy(vmdata, ev) as any && false || del(vmdata, ev);

const paste: Consumer = (vmdata) => vmdata.stateMachine.loadData(vmdata.clipboard, false, vmdata.copyOffset += 10);

export default function () {
    registerKeybind("c", getValidator(Modifier.SHORTCUT), copy);
    registerKeybind("x", getValidator(Modifier.SHORTCUT), cut);
    registerKeybind("v", getValidator(Modifier.SHORTCUT), paste);
    registerKeybind("Backspace", getValidator(), del);
    registerKeybind("Delete", getValidator(), del);
}
