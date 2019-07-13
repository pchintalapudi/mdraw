import { StateMachine } from "@/state_machine";

export type Handler = [string, (ev: Event) => void];

export function data() {
    return {
        stateMachine: new StateMachine(),
        clipboard: "",
        omit: false,
        lockout: true,
        loading: 0,
        d3: false,
        copyOffset: 0,
        printing: false
    };
}

export function serialize({ clipboard, omit, d3 }: ReturnType<typeof data>) {
    return JSON.stringify({ clipboard, omit, d3 });
}
