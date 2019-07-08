import { RGroup, LonePair } from "@/models";
import { getFormalCharge } from "./utils";
import { inferAngles } from "./inferAngles";
export function inferOxygen(atom: RGroup) {
    const formalCharge = getFormalCharge(atom, 6);
    const lonePairs = [] as LonePair[];
    if (!atom.charge) {
        let lonePairCount = 8;
        lonePairCount -= formalCharge.bound * 2;
        lonePairCount -= formalCharge.free;
        const angles = inferAngles(atom, Math.ceil(lonePairCount / 2));
        if (lonePairCount % 2) {
            lonePairCount--;
            lonePairs.push(new LonePair(atom, 1, angles.pop()));
        }
        lonePairCount >>= 1;
        for (let i = 0; i < lonePairCount; i++) {
            lonePairs.push(new LonePair(atom, 2, angles[i]));
        }
        atom.lonePairs.push(...lonePairs);
        return [[], lonePairs, atom.charge = -2 + formalCharge.bound] as [RGroup[], LonePair[], number];
    } else {
        
    }
}
