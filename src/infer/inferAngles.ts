import { RGroup } from "@/models";
import { Constants } from "@/utils";

function normalize(rad: number) {
    return rad > 0 && rad < Math.PI * 2 ? rad : (rad % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
}
//Only for entities 0-3
export function inferAngles(rgroup: RGroup, entityCount: integer) {
    switch (entityCount) {
        case 0:
            return [];
        case 1:
            switch (rgroup.bonds.size) {
                case 0:
                    return [0];
                case 1: {
                    const bond = rgroup.bonds.values().next().value;
                    return bond.bondOrder === 3 ?
                        [normalize(bond.getAngle(rgroup) + Math.PI)]
                        : [normalize(bond.getAngle(rgroup) + Math.PI / 3 * 2)];
                }
                case 2: {
                    const bonds = [] as number[];
                    rgroup.bonds.forEach(b => bonds.push(normalize(b.getAngle(rgroup))));
                    const range = bonds[1] - bonds[0];
                    return Math.abs(range) < Math.PI
                        ? [normalize(bonds[0] + range / 2 + Math.PI)] : [normalize(bonds[0] + range / 2)];
                }
                default: {
                    const bonds = [] as number[];
                    rgroup.bonds.forEach(b => bonds.push(normalize(b.getAngle(rgroup))));
                    bonds.sort((a, b) => a - b);
                    const ranges = [[0, -1]] as Array<[number, number]>;
                    bonds.forEach((a, i) => ranges.push([a - ranges[i][0], (i - 1 + bonds.length) % bonds.length]));
                    ranges.splice(0, 2, [ranges[1][0] + Math.PI * 2 - bonds[bonds.length - 1], bonds.length - 1]);
                    ranges.sort((a, b) => b[0] - a[0]);
                    return [ranges[0][0] + bonds[ranges[0][1]]];
                }
            }
        case 2:
            switch (rgroup.bonds.size) {
                case 0:
                    return [0, Math.PI];
                case 1: {
                    const angle = rgroup.bonds.values().next().value.getAngle(rgroup);
                    return [normalize(angle + Math.PI * 2 / 3), normalize(angle + Math.PI * 4 / 3)];
                }
                // case 2:
                //     const angles = [] as number[];
                //     rgroup.bonds.forEach(b => angles.push(b.getAngle(rgroup)));
                //     return Math.abs(normalize(angles[1] - angles[0]) - Math.PI) < 0.0001
                //         ? [normalize(angles[0] + Math.PI / 2), normalize(angles[1] + Math.PI / 2)]
                //         : [normalize(angles[0] + Math.PI), normalize(angles[1] + Math.PI)];
                default:
                    const bonds = [] as number[];
                    rgroup.bonds.forEach(b => bonds.push(normalize(b.getAngle(rgroup))));
                    bonds.sort((a, b) => a - b);
                    const ranges = [[0, -1]] as Array<[number, number]>;
                    bonds.forEach((a, i) => ranges.push([a - ranges[i][0], (i - 1 + bonds.length) % bonds.length]));
                    ranges.splice(0, 2, [ranges[1][0] + Math.PI * 2 - bonds[bonds.length - 1], bonds.length - 1]);
                    ranges.sort((a, b) => b[0] - a[0]);
                    return getAnglesForArc(bonds[ranges[0][1]],
                        bonds[(ranges[0][1] + 1) % bonds.length], entityCount + 1).slice(1).map(normalize);
            }
        default:
            switch (rgroup.bonds.size) {
                case 0:
                    return getAnglesForArc(0, Math.PI * 2, entityCount);
                case 1:
                    const angle = rgroup.bonds.values().next().value.getAngle(rgroup);
                    return getAnglesForArc(angle, angle + Math.PI * 2, entityCount + 1).slice(1).map(normalize);
                default:
                    return [];
            }
    }
}

type integer = number;

function getAnglesForArc(start: number, end: number, angleCount: integer) {
    const ret = [] as number[];
    if (end < start) end += Math.PI * 2;
    for (let i = start; i < end; i += (end - start) / angleCount) ret.push(normalize(i));
    return ret;
}

export function shiftToAngle(atom: RGroup, move: RGroup, angle: number) {
    move.x = Math.cos(angle) * (Constants.bondLength - 15) + atom.x;
    move.y = Math.sin(angle) * (Constants.bondLength - 15) + atom.y;
}
