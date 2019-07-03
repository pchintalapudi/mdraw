import { IO, wrap } from "./io";

const FILE_NAME_FILE = "filenames";

function spawnConfirmationDialog(selectedFile: string, resolve: (value: any) => void, information: boolean) {
    const confirmationDialog = document.createElement("div");
    confirmationDialog.setAttribute("style",
        "background-color:#00000088;top:0;left:0;right:0;bottom:0;position:fixed;\
        display:flex;justify-content:center;align-items:center;");
    confirmationDialog.onclick = () => document.body.lastChild!.remove();
    const dialog = document.createElement("div");
    dialog.setAttribute("style", "background-color:white;");
    dialog.onclick = Event.prototype.stopPropagation;
    dialog.appendChild(document.createTextNode(selectedFile +
        " already exists. Do you want to overwrite this file?"));
    const actions = document.createElement("div");
    actions.setAttribute("style",
        "display:flex;justify-content:space-between;align-items:center;");
    dialog.appendChild(actions);
    if (!information) {
        const yes = document.createElement("div");
        yes.classList.add("button");
        yes.onclick = () => { confirmationDialog.remove(); resolve(selectedFile); };
        yes.appendChild(document.createTextNode("Yes"));
        actions.appendChild(yes);
    }
    const no = document.createElement("div");
    no.classList.add("cancel-button");
    no.onclick = () => confirmationDialog.remove();
    no.appendChild(document.createTextNode(information ? "Ok" : "No"));
    actions.appendChild(no);
    confirmationDialog.appendChild(dialog);
    document.body.appendChild(confirmationDialog);
    Promise.resolve().then(() => no.focus());
}

export class LocalIO extends IO {

    private prevFile = null as string | null;

    public async getFile(write: boolean, saveFile = true, def = false) {
        if (def && this.prevFile !== null) return Promise.resolve(this.prevFile);
        const fileNameStr = await this.read(FILE_NAME_FILE, false);
        if (fileNameStr === null && !write) await this.write(FILE_NAME_FILE, "", false);
        const fileNames = fileNameStr ? fileNameStr.split(" ") : [];
        let resolve: (value: any) => void, reject: (error: any) => void;
        const promise = new Promise<string | null>((rs, rj) => {
            reject = rj;
            resolve = saveFile ? (value: any) => {
                if (value !== null) this.prevFile = value;
                rs(value);
            } : rs;
        });
        const root = document.createElement("div");
        try {
            root.setAttribute("style", "position:fixed;top:0;left:0;right:0;bottom:0;\
            background-color:#00000088;opacity:0;transition:opacity 300ms");
            root.onclick = (ev) => {
                resolve(null);
                ev.stopPropagation();
            };
            const backing = document.createElement("div");
            root.appendChild(backing);
            backing.setAttribute("style", "position:fixed;top:10vh;left:10vw;\
            bottom:10vh;right:10vw;background-color:white;display:flex;flex-flow:column nowrap;");
            backing.onclick = (ev) => ev.stopPropagation();
            const files = document.createElement("div");
            files.setAttribute("style", "overflow:auto;flex:1;");
            let selectedFile = "";
            const fileElements: HTMLElement[] = [];
            const clickHandler = (name: string, element: HTMLElement) => {
                selectedFile = name;
                fileElements.forEach(e => e.style.backgroundColor = e === element ? "#0088ff33" : "white");
                element.focus();
            };
            const dblClickHandler = (name: string) => {
                if (write) {
                    spawnConfirmationDialog(selectedFile, resolve, !write);
                } else {
                    resolve(name);
                }
            };
            const keyHandler = async (event: KeyboardEvent, name: string) => {
                switch (event.key) {
                    default:
                        return;
                    case "Delete":
                        const idx = fileNames.indexOf(name);
                        fileNames.splice(idx, 1);
                        files.children.item(idx)!.remove();
                        await this.write(FILE_NAME_FILE, fileNames.join(" "), false);
                        break;
                    case "Enter":
                        resolve(name);
                        break;
                }
            };
            fileElements.push(...fileNames.map(name => {
                const element = document.createElement("div");
                element.appendChild(document.createTextNode(name));
                element.onclick = () => clickHandler(name, element);
                element.ondblclick = () => dblClickHandler(name);
                element.onkeydown = (evt) => keyHandler(evt, name);
                files.appendChild(element);
                return element;
            }));
            backing.appendChild(files);
            const buttons = document.createElement("span");
            backing.appendChild(buttons);
            buttons.setAttribute("style", "display:flex;flex-flow:row-reverse wrap;");
            const successButton = document.createElement("div");
            successButton.setAttribute("tabindex", "0");
            successButton.classList.add("button");
            successButton.innerText = write ? "Save" : "Load";
            successButton.onclick = () => {
                if (selectedFile) {
                    fileNames.includes(selectedFile) !== write
                        ? resolve(selectedFile) : spawnConfirmationDialog(selectedFile, resolve, !write);
                }
            };
            const cancelButton = document.createElement("div");
            cancelButton.setAttribute("tabindex", "0");
            cancelButton.innerText = "Cancel";
            cancelButton.classList.add("cancel-button");
            buttons.appendChild(cancelButton);
            buttons.appendChild(successButton);
            cancelButton.onclick = () => resolve(null);
            Promise.resolve().then(() => root.style.opacity = "1");
            document.body.appendChild(root);
        } catch (error) {
            reject!(error);
        }
        return promise.finally(() => {
            root.style.opacity = "0";
            window.setTimeout(() => root.remove(), 300);
        });
    }

    public async write(filename: string, data: string, session: boolean) {
        return wrap(() => this.saveInternal(filename, data, session));
    }

    public async read(filename: string, session: boolean) {
        return wrap(() => this.loadInternal(filename, session));
    }

    private saveInternal(filename: string, data: string, session: boolean) {
        (session ? sessionStorage : localStorage).setItem(filename, data);
    }

    private loadInternal(filename: string, session: boolean) {
        return (session ? sessionStorage : localStorage).getItem(filename);
    }
}
