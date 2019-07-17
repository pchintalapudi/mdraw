import { RGroup, LonePair, Bond } from "@/models";
import { getFormalCharge } from "./utils";
import { inferAngles, shiftToAngle } from "./inferAngles";
export function inferCarbon(atom: RGroup) {
    const formalCharge = getFormalCharge(atom, 4);
    const charge = atom.charge;
    const hydrogens = [] as RGroup[];
    for (let i = 0; i < Math.max(Math.min(formalCharge.formalCharge - Math.abs(charge), 4), 0); i++) {
        const h = new RGroup({ name: "Hydrogen", abbrev: "H" });
        h.setBond(atom, new Bond(atom, h));
        hydrogens.push(h);
    }
    const lonePairs = [] as LonePair[];
    for (let i = 0; i < Math.max(0, -charge); i++) {
        const lp = new LonePair(atom, 2);
        lonePairs.push(lp);
    }
    const angles = inferAngles(atom, hydrogens.length + lonePairs.length);
    if (hydrogens.length === 2 && lonePairs.length === 1 && atom.bondSize === 1) {
        shiftToAngle(atom, hydrogens[0], angles[0]);
        lonePairs[0].angle = angles[1] * 180 / Math.PI;
        shiftToAngle(atom, hydrogens[1], angles[2]);
    } else {
        hydrogens.forEach((h, i) => shiftToAngle(atom, h, angles[i]));
        lonePairs.forEach((lp, i) => lp.angle = angles[hydrogens.length + i] * 180 / Math.PI);
    }
    hydrogens.forEach(h => atom.setBond(h, h.getBond(atom)!));
    lonePairs.forEach(lp => atom.lonePairs.push(lp));
    return [hydrogens, lonePairs, 0] as [RGroup[], LonePair[], number];
}
