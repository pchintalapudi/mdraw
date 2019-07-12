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
        handlers: [] as Handler[],
        copyOffset: 0
    };
}

export function serialize({ clipboard, omit, d3 }: ReturnType<typeof data>) {
    return JSON.stringify({ clipboard, omit, d3 });
}
