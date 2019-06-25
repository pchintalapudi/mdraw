import { StateMachine, Action } from "@/state_machine";
import { element, RGroup } from "@/models";

export function data() {
    return {
        stateMachine: new StateMachine(),
        clipboard: "",
        omit: false,
        lastElement: element(6),
        lockout: false,
        d3: true,
        keyHandler: undefined as any
    };
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
                //TODO: Save here!!!
                break;
            }
        case "S":
            if (event.ctrlKey && event.shiftKey) {
                //TODO: Save as here!!!
                break;
            }
            return;
        case "o":
            if (event.ctrlKey) {
                //TODO: Open a new file here!!!
                break;
            } else {
                vmdata.omit = !vmdata.omit;
                break;
            }
        case "i":
            if (event.ctrlKey) {
                //TODO: Import a file here!!!
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
    }
    event.preventDefault();
}
