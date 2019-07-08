import { RGroup, LonePair } from "@/models";
export function inferOxygen(atom: RGroup) {
    let bondCount = 0;
    atom.bonds.forEach(b => bondCount += b.bondOrder);
    switch (bondCount) {
        case 1:
            console.log("add 3 lone pairs");
            if (!atom.charge) atom.charge = -1;
            break;
        case 2:
            console.log("add 2 lone pairs");
            break;
        case 3:
            console.log("add 1 lone pair");
            if (!atom.charge) atom.charge = 1;
            break;
        default:
            console.log("ignore");
            break;
    }
}
