import { IO } from "./io";

interface Deferred { resolve: (value: any) => void; reject: (reason: any) => void; }

interface Message {
    type: string;
    filename?: string;
    data?: string;
    session?: boolean;
    exception?: Error;
    id: number;
}

export class IframeIO extends IO {

    private port?: MessagePort;
    private messageQueue = new Map<string, Message>();
    private responseMap = new Map<number, Deferred>();
    private id = 0;

    constructor() {
        super(false);
        this.port = undefined;
        window.onmessage = this.initPort;
    }

    public async getFile(write: boolean, saveFile = true, def = false) {
        return this.requestResponse<string | null>({
            type: "getFile",
            data: `${write}|${saveFile}|${!!def}`, id: this.id++
        });
    }

    public async write(filename: string, data: string, session: boolean) {
        return this.requestResponse<void>({ type: "save", filename, data, session, id: this.id++ });
    }

    public async read(filename: string, session: boolean) {
        return this.requestResponse<string | null>({ type: "load", filename, session, id: this.id++ });
    }

    private initPort(evt: MessageEvent) {
        this.port = evt.ports[0];
        const queue = Array.from(this.messageQueue.values());
        queue.sort((m1, m2) => m1.id - m2.id);
        this.port.onmessage = (event) => this.handleMessage(event.data);
        this.port.onmessageerror = (event) => {
            this.responseMap.forEach(d => d.reject(event.data));
            this.responseMap.clear();
        };
        queue.forEach(m => this.port!.postMessage(m));
    }

    private async requestResponse<T>(message: Message) {
        let resolve: (value: any) => void, reject: (reason: any) => void;
        const promise = new Promise<T>((rs, rj) => { resolve = rs; reject = rj; });
        this.responseMap.set(message.id, { resolve: resolve!, reject: reject! });
        this.sendMessage(message);
        return promise;
    }

    private sendMessage(message: Message) {
        if (!this.port) this.messageQueue.set(message.type, message);
        else this.port.postMessage(message);
    }

    private handleMessage(message: Message) {
        switch (message.type) {
            default:
                return;
            case "resolve":
                this.responseMap.get(message.id)!.resolve(message.data);
                break;
            case "reject":
                this.responseMap.get(message.id)!.reject(message.exception);
                break;
        }
        this.responseMap.delete(message.id);
    }
}
