import { expSVG } from "./svg";
import { StateMachine } from "@/state_machine";

export function expImage(stateMachine: StateMachine, type: "png" | "jpeg") {
    try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        const loader = new Image();
        loader.width = canvas.width = stateMachine.view.viewPort.width;
        loader.height = canvas.height = stateMachine.view.viewPort.height;
        loader.src = expSVG(stateMachine);
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(loader, 0, 0, loader.width, loader.height);
        const dataURL = canvas.toDataURL(type === "jpeg" ? "image/jpeg" : undefined);
        const url = dataURL;
        // console.log(url);
        return url;
    } catch (error) {
        // console.error(error);
    }
    return null;
}
