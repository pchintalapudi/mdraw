import { expSVG } from "./svg";
import { expImage } from "./pixel";
import { StateMachine } from "@/state_machine";

export function exp(stateMachine: StateMachine, type: "svg" | "png" | "jpeg") {
    return type === "svg" ? expSVG(stateMachine) : expImage(stateMachine, type);
}
