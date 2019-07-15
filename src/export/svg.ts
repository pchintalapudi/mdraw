import { StateMachine } from "@/state_machine";
export function exportPrologue(stateMachine: StateMachine) {
    const svg = document.getElementById("svg")! as any as SVGSVGElement;
    svg.setAttribute("viewBox", stateMachine.view.viewBox.serialized.map(n => n.toString()).join(" "));
    const lastChild = svg.lastChild!;
    lastChild.remove();
    return lastChild;
}

export function expSVG(stateMachine: StateMachine) {
    const lastChild = exportPrologue(stateMachine);
    const svg = document.getElementById("svg")!.outerHTML;
    exportEpilogue(stateMachine, lastChild);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function exportEpilogue(stateMachine: StateMachine, lastChild: Node) {
    const svg = document.getElementById("svg")! as any as SVGSVGElement;
    svg.setAttribute("viewBox", stateMachine.view.viewPort.serialized.map(n => n.toString()).join(" "));
    svg.appendChild(lastChild);
}
