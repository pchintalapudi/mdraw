import { RGroup } from "@/models";

export function getFormalCharge(atom: RGroup, valence: number) {
    const free = atom.lonePairs.map(lp => lp.count).reduce((a, b) => a + b, 0);
    let bound = 0;
    atom.bonds.forEach(b => bound += b.bondOrder);
    return { formalCharge: valence - free - bound, free, bound };
}
