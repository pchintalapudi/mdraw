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
        super();
        this.port = undefined;
        window.onmessage = this.initPort;
    }

    public async getFile() {
        let resolve: (value: any) => void, reject: (reason: any) => void;
        const promise = new Promise<string | null>((rs, rj) => { resolve = rs; reject = rj; });
        this.responseMap.set(this.id, { resolve: resolve!, reject: reject! });
        this.sendMessage({ type: "getFile", id: this.id++ });
        return promise;
    }

    public async write(filename: string, data: string, session: boolean) {
        let resolve: (value: any) => void, reject: (reason: any) => void;
        const promise = new Promise<void>((rs, rj) => { resolve = rs; reject = rj; });
        this.responseMap.set(this.id, { resolve: resolve!, reject: reject! });
        this.sendMessage({ type: "save", filename, data, session, id: this.id++ });
        return promise;
    }

    public async read(filename: string, session: boolean) {
        let resolve: (value: any) => void, reject: (reason: any) => void;
        const promise = new Promise<string | null>((rs, rj) => { resolve = rs; reject = rj; });
        this.responseMap.set(this.id, { resolve: resolve!, reject: reject! });
        this.sendMessage({ type: "load", filename, session, id: this.id++ });
        return promise;
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
