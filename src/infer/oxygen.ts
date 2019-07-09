import { RGroup, LonePair, Bond } from "@/models";
import { getFormalCharge } from "./utils";
import { inferAngles } from "./inferAngles";
export function inferOxygen(atom: RGroup): [RGroup[], LonePair[], number] {
    const formalCharge = getFormalCharge(atom, 6);
    const lonePairs = [] as LonePair[];
    const hydrogens = [] as RGroup[];
    let dcharge = 0;
    if (!atom.charge) {
        let lonePairCount = 8 - formalCharge.bound * 2 - formalCharge.free;
        const angles = inferAngles(atom, Math.ceil(lonePairCount / 2));
        if (lonePairCount % 2) {
            lonePairCount--;
            lonePairs.push(new LonePair(atom, 1, angles.pop()));
            lonePairCount--;
        }
        for (let i = 0; i < (lonePairCount >> 1); i++) {
            lonePairs.push(new LonePair(atom, 2, angles[i] * 180 / Math.PI));
        }
        atom.lonePairs.push(...lonePairs);
        dcharge = atom.charge = -2 + formalCharge.bound;
    } else {
        switch (atom.charge) {
            default:
                break;
            case 1:
            //3 bonds, 2 free electrons
            case 0:
            //2 bonds, 4 free electrons
            case -1:
            //1 bond, 6 free electrons
            case -2:
                //0 bonds, 8 free electrons
                const addBonds = Math.max(3, Math.min(0, 2 + atom.charge));
                let free = Math.max(Math.min(4 - 2 * atom.charge - formalCharge.free, 8), 0);
                const angles = inferAngles(atom, Math.ceil(free / 2) + addBonds);
                for (let i = 0; i < addBonds; i++) {
                    const h = new RGroup({ name: "Hydrogen", abbrev: "H" });
                    const b = new Bond(atom, h);
                    h.bonds.set(atom, b);
                    atom.bonds.set(h, b);
                    hydrogens.push(h);
                }
                if (free % 2) {
                    lonePairs.push(new LonePair(atom, 1, angles[addBonds]));
                    free--;
                }
                for (let i = 0; i < free; i++) {
                    const lp = new LonePair(atom, 2, angles[i + addBonds]);
                    atom.lonePairs.push(lp);
                    lonePairs.push(lp);
                }
                break;
        }
    }
    return [hydrogens, lonePairs, dcharge];
}
