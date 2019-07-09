import { StateMachine, Action } from "@/state_machine";
import { RGroup } from "@/models";
import { io } from "@/io";

const ielement = { name: "Carbon", abbrev: "C" };

export type Handler = [string, (ev: Event) => void];

export function data() {
    return {
        stateMachine: new StateMachine(),
        clipboard: "",
        omit: false,
        lastElement: ielement,
        lockout: true,
        d3: false,
        handlers: [] as Handler[]
    };
}

export function serialize({ clipboard, omit, lastElement, d3 }: ReturnType<typeof data>) {
    return JSON.stringify({ clipboard, omit, lastElement, d3 });
}

export function keyHandler(vmdata: ReturnType<typeof data>, event: KeyboardEvent) {
    const stateMachine = vmdata.stateMachine;
    switch (event.key) {
        default:
            return;
        case "Escape":
            stateMachine.execute(Action.CANCEL, undefined as any);
            break;
        case "z":
            if (!event.shiftKey && event.ctrlKey) {
                stateMachine.undo();
                break;
            }
        case "Z":
            if (!event.shiftKey || !event.ctrlKey) return;
        case "y":
            if (event.ctrlKey) {
                stateMachine.redo();
                break;
            }
            return;
        case "c":
        case "x":
            if (!event.ctrlKey) return;
            vmdata.clipboard = stateMachine.copySelected();
            if (event.key === "c") break;
        case "Delete":
            stateMachine.deleteSelected();
            break;
        case "v":
            if (!event.ctrlKey) return;
            stateMachine.loadData(vmdata.clipboard, false);
            break;
        case "s":
            if (!event.ctrlKey) return;
            if (!event.shiftKey) {
                if (!stateMachine.saved) {
                    io.getFile(true, true, true).then(file => {
                        if (file !== null) return io.write(file, stateMachine.getSaveData(), false);
                    }).then(() => stateMachine.markSaved());
                }
                break;
            }
        case "S":
            if (event.ctrlKey && event.shiftKey) {
                io.getFile(true).then(file => {
                    if (file !== null) return io.write(file, stateMachine.getSaveData(), false);
                }).then(() => stateMachine.markSaved());
                break;
            }
            return;
        case "o":
            if (event.ctrlKey) {
                io.getFile(false).then((file: string | null) => {
                    return file !== null ? io.read(file, false) : null;
                }).then((read: string | null) => {
                    if (read !== null) stateMachine.loadData(read, true);
                });
                break;
            } else {
                vmdata.omit = !vmdata.omit;
                break;
            }
        case "i":
            if (event.ctrlKey) {
                io.getFile(false).then((file: string | null) => {
                    return file !== null ? io.read(file, false) : null;
                }).then((read: string | null) => {
                    if (read !== null) stateMachine.loadData(read, false);
                });
                break;
            }
            return;
        case "-": {
            const rgroups =
                (stateMachine.stateVariables.selected
                    .filter(r => r instanceof RGroup) as RGroup[]);
            rgroups.forEach(r => r.charge--);
            stateMachine.log(_ => rgroups.forEach(r => r.charge++), _ => rgroups.forEach(r => r.charge--));
            break;
        }
        case "+": {
            const rgroups =
                (stateMachine.stateVariables.selected
                    .filter(r => r instanceof RGroup) as RGroup[]);
            rgroups.forEach(r => r.charge++);
            stateMachine.log(_ => rgroups.forEach(r => r.charge--), _ => rgroups.forEach(r => r.charge++));
            break;
        }
        case " ":
            stateMachine.execute(Action.BUTTON, { target: "spawn", payload: vmdata.lastElement });
            break;
        case "d":
            if (event.ctrlKey) {
                vmdata.omit = false;
                vmdata.d3 = !vmdata.d3;
                break;
            }
            return;
    }
    event.preventDefault();
}
