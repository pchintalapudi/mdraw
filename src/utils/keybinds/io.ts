import { registerKeybind, getValidator, Consumer } from "./registration";
import io from "@/io";
import { Modifier } from "./modifiers";

function err(e: any) {
    // tslint:disable-next-line: no-console
    if (DEBUG) console.error(e);
}

const save: Consumer = (vmdata) => {
    if (!vmdata.stateMachine.saved) {
        vmdata.loading++;
        io.getFile(true, true, true).then(file => {
            if (file !== null) {
                vmdata.stateMachine.markSaved();
                return io.write(file, vmdata.stateMachine.getSaveData(), false);
            }
        }).catch(err).finally(() => vmdata.loading--);
    }
};

const saveAs: Consumer = (vmdata) => {
    io.getFile(true).then(file => {
        if (file !== null) {
            vmdata.stateMachine.markSaved();
            return io.write(file, vmdata.stateMachine.getSaveData(), false);
        }
    }).catch(err).finally(() => vmdata.loading--);
};

const open: Consumer = (vmdata) => {
    vmdata.loading++;
    io.getFile(false).then(file => file !== null ? io.read(file, false) : null)
        .then(data => data !== null && vmdata.stateMachine.loadData(data, true))
        .catch(err).finally(() => vmdata.loading--);
};

const load: Consumer = (vmdata) => {
    vmdata.loading++;
    io.getFile(false).then(file => file !== null ? io.read(file, false) : null)
        .then(data => data !== null && vmdata.stateMachine.loadData(data, false))
        .catch(err).finally(() => vmdata.loading--);
};

export default function () {
    registerKeybind("s", getValidator(Modifier.SHORTCUT), save);
    registerKeybind("S", getValidator(Modifier.SHORTCUT, Modifier.SHIFT), saveAs);
    registerKeybind("o", getValidator(Modifier.SHORTCUT), open);
    registerKeybind("l", getValidator(Modifier.SHORTCUT), load);
}
