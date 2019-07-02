import { StateMachine } from "@/state_machine";
export abstract class IO {

    private stateMachine?: StateMachine;

    public async abstract getFile(write: boolean, choose?:boolean): Promise<string | null>;

    public async abstract write(filename: string, data: string, session: boolean): Promise<void>;

    public async abstract read(filename: string, session: boolean): Promise<string | null>;

    public inject(stateMachine: StateMachine) { this.stateMachine = stateMachine; }

    protected getStateMachine() {
        return this.stateMachine;
    }
}

export function wrap<T>(func: () => T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        try {
            resolve(func());
        } catch (error) {
            reject(error);
        }
    });
}
