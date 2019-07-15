import { RGroup, LonePair } from "@/models";
import { inferOxygen } from "./oxygen";
import { inferCarbon } from "./carbon";
import { inferNitrogen } from "./nitrogen";

export function infer(atom: RGroup) {
    switch (atom.payload.name) {
        case "Oxygen":
            return inferOxygen(atom);
        case "Carbon":
            return inferCarbon(atom);
        case "Nitrogen":
            return inferNitrogen(atom);
        default:
            return [[], [], 0] as [RGroup[], LonePair[], number];
    }
}
