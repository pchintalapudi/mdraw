import { Bond, BondState } from "@/models";

export type ArrayPoint = [number, number];
export type BezierCurve = [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint];

export function deepCopy(curves: BezierCurve[]): BezierCurve[] {
    const copy = [];
    for (const curve of curves) {
        const curveCopy = [];
        for (const point of curve) {
            curveCopy.push([point[0], point[1]]);
        }
        copy.push(curveCopy as BezierCurve);
    }
    return copy;
}

export function shrink(start: ArrayPoint, end: ArrayPoint, dist: number): ArrayPoint {
    const v1 = end[0] - start[0];
    const v2 = end[1] - start[1];
    const d = Math.hypot(v1, v2);
    return [start[0] + (v1 / d) * dist, start[1] + (v2 / d) * dist];
}

export function bondControlPoint(oldControlPoint: ArrayPoint, bond: Bond): ArrayPoint {
    const bsx = bond.start.x,
        bsy = bond.start.y;
    const bex = bond.end.x,
        bey = bond.end.y;
    const bvx = bex - bsx,
        bvy = bey - bsy;
    const cvx = oldControlPoint[0] - bond.x,
        cvy = oldControlPoint[1] - bond.y;
    const dist = Math.hypot(cvx, cvy);
    if (dist < 10) return oldControlPoint;
    const pvx = bvy,
        pvy = -bvx;
    const pd = Math.hypot(pvx, pvy);
    const fvx = (pvx / pd) * dist,
        fvy = (pvy / pd) * dist;
    const sgn = Math.sign(
        ((bsy - bey) * (oldControlPoint[0] - bsx) +
            (bex - bsy) * (oldControlPoint[1] - bsy)) *
        ((bsy - bey) * (fvx - bsx) + (bex - bsy) * (fvy - bsy))
    );
    return [bond.x + fvx * sgn, bond.y + fvy * sgn];
}

export function getBondDistance(bond: Bond, leading: boolean) {
    switch (bond.state) {
        default:
            return leading ? 6 : 10;
        case BondState.FORWARD:
        case BondState.RETREATING:
            return leading ? 8 : 12;
        case BondState.THICK:
        case BondState.DOUBLE:
            return leading ? 10 : 14;
        case BondState.DOUBLE_LEFT:
        case BondState.DOUBLE_RIGHT:
            return leading ? 9 : 13;
        case BondState.TRIPLE:
        case BondState.TRIPLE_SHORT:
            return leading ? 11 : 15;
    }
}
