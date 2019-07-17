import { RGroup, LonePair, Bond } from "@/models";
import { getFormalCharge } from "./utils";
import { inferAngles, shiftToAngle } from "./inferAngles";
export function inferNitrogen(atom: RGroup) {
    const formalCharge = getFormalCharge(atom, 5);
    const lonePairs = [] as LonePair[];
    const hydrogens = [] as RGroup[];
    let dcharge = 0;
    if (!atom.charge) {
        if (formalCharge.bound === 4) {
            dcharge = 1;
        } else {
            dcharge = Math.min(2 - formalCharge.free, 0);
            for (let i = 0; i < 3 - formalCharge.bound; i++) {
                const h = new RGroup({ name: "Hydrogen", abbrev: "H" });
                const bond = new Bond(atom, h);
                h.setBond(atom, bond);
                hydrogens.push(h);
            }
            let free = 2 - formalCharge.free;
            if (free & 1) {
                free--;
                lonePairs.push(new LonePair(atom, 1));
            }
            for (let i = 0; i < free / 2; i++) {
                const lp = new LonePair(atom, 2);
                lonePairs.push(lp);
            }
        }
    } else {
        for (let i = 0; i < 3 + atom.charge - formalCharge.bound; i++) {
            const h = new RGroup({ name: "Hydrogen", abbrev: "H" });
            const bond = new Bond(atom, h);
            h.setBond(atom, bond);
            hydrogens.push(h);
        }
        let free = 2 - 2 * atom.charge - formalCharge.free;
        if (free & 1) {
            free--;
            lonePairs.push(new LonePair(atom, 1));
        }
        for (let i = 0; i < free / 2; i++) {
            lonePairs.push(new LonePair(atom, 2));
        }
    }
    const angles = inferAngles(atom, hydrogens.length);
    hydrogens.forEach((h, i) => shiftToAngle(atom, h, angles[i]));
    hydrogens.forEach(h => atom.setBond(h, h.getBond(atom)!));
    const lpAngles = inferAngles(atom, lonePairs.length);
    lonePairs.forEach((lp, i) => lp.angle = lpAngles[i] * 180 / Math.PI);
    lonePairs.forEach(lp => atom.lonePairs.push(lp));
    return [hydrogens, lonePairs, dcharge] as [RGroup[], LonePair[], number];
}
