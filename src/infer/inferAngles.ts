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
            switch (rgroup.bonds.size + rgroup.lonePairs.length) {
                case 0:
                    return [0];
                case 1: {
                    if (rgroup.bonds.size) {
                        const bond = rgroup.nextBond;
                        return bond.bondOrder === 3 ?
                            [normalize(bond.getAngle(rgroup) + Math.PI)]
                            : [normalize(bond.getAngle(rgroup) + Math.PI / 3 * 2)];
                    } else {
                        return [rgroup.lonePairs[0].angle * Math.PI / 180 + Math.PI];
                    }
                }
                case 2: {
                    const angles = [] as number[];
                    rgroup.bonds.forEach(b => angles.push(normalize(b.getAngle(rgroup))));
                    rgroup.lonePairs.forEach(r => angles.push(normalize(r.angle * Math.PI / 180)));
                    const range = angles[1] - angles[0];
                    return Math.abs(range) < Math.PI
                        ? [normalize(angles[0] + range / 2 + Math.PI)] : [normalize(angles[0] + range / 2)];
                }
                default: {
                    const angles = [] as number[];
                    rgroup.bonds.forEach(b => angles.push(normalize(b.getAngle(rgroup))));
                    rgroup.lonePairs.forEach(r => angles.push(normalize(r.angle * Math.PI / 180)));
                    angles.sort((a, b) => a - b);
                    const ranges = [[0, -1]] as Array<[number, number]>;
                    angles.forEach((a, i) => ranges.push([a - ranges[i][0], (i - 1 + angles.length) % angles.length]));
                    ranges.splice(0, 2, [ranges[1][0] + Math.PI * 2 - angles[angles.length - 1], angles.length - 1]);
                    ranges.sort((a, b) => b[0] - a[0]);
                    return getAnglesForArc(angles[ranges[0][1]],
                        angles[(ranges[0][1] + 1) % angles.length], entityCount + 1).slice(1).map(normalize);
                }
            }
        default:
            switch (rgroup.bonds.size + rgroup.lonePairs.length) {
                case 0:
                    return getAnglesForArc(0, Math.PI * 2, entityCount);
                case 1:
                    const angle = rgroup.bonds.size
                        ? rgroup.nextBond.getAngle(rgroup)
                        : rgroup.lonePairs[0].angle * Math.PI / 180;
                    return getAnglesForArc(angle, angle + Math.PI * 2, entityCount + 1).slice(1).map(normalize);
                default:
                    const angles = [] as number[];
                    rgroup.bonds.forEach(b => angles.push(normalize(b.getAngle(rgroup))));
                    rgroup.lonePairs.forEach(r => angles.push(normalize(r.angle * Math.PI / 180)));
                    angles.sort((a, b) => a - b);
                    const ranges = [[0, -1]] as Array<[number, number]>;
                    angles.forEach((a, i) => ranges.push([a - ranges[i][0], (i - 1 + angles.length) % angles.length]));
                    ranges.splice(0, 2, [ranges[1][0] + Math.PI * 2 - angles[angles.length - 1], angles.length - 1]);
                    ranges.sort((a, b) => b[0] - a[0]);
                    return getAnglesForArc(angles[ranges[0][1]],
                        angles[(ranges[0][1] + 1) % angles.length], entityCount + 1).slice(1).map(normalize);
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
