import { RGroup, LonePair, Bond } from "@/models";
import { getFormalCharge } from "./utils";
import { inferAngles, shiftToAngle } from "./inferAngles";
export function inferCarbon(atom: RGroup) {
    const formalCharge = getFormalCharge(atom, 4);
    const charge = atom.charge;
    const hydrogens = [] as RGroup[];
    for (let i = 0; i < formalCharge.formalCharge - Math.abs(charge); i++) {
        const h = new RGroup({ name: "Hydrogen", abbrev: "H" });
        h.bonds.set(atom, new Bond(atom, h));
        hydrogens.push(h);
    }
    const lonePairs = [] as LonePair[];
    for (let i = 0; i < Math.max(0, -charge); i++) {
        const lp = new LonePair(atom, 2);
        atom.lonePairs.push(lp);
        lonePairs.push(lp);
    }
    const angles = inferAngles(atom, hydrogens.length + lonePairs.length);
    hydrogens.forEach(h => atom.bonds.set(h, h.bonds.get(atom)!));
    if (hydrogens.length === 2 && lonePairs.length === 1 && atom.bonds.size === 1) {
        shiftToAngle(atom, hydrogens[0], angles[0]);
        lonePairs[0].angle = angles[1];
        shiftToAngle(atom, hydrogens[1], angles[2]);
    } else {
        hydrogens.forEach((h, i) => shiftToAngle(atom, h, angles[i]));
        lonePairs.forEach((lp, i) => lp.angle = angles[hydrogens.length + i]);
    }
    return [hydrogens, lonePairs] as [RGroup[], LonePair[]];
}
