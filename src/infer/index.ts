import { RGroup, LonePair } from "@/models";
import { inferOxygen } from "./oxygen";
import { inferCarbon } from "./carbon";

export function infer(atom: RGroup) {
    switch (atom.payload.name) {
        // case "Oxygen":
        //     return inferOxygen(atom);
        case "Carbon":
            return inferCarbon(atom);
        default:
            return [[], []] as [RGroup[], LonePair[]];
    }
}
