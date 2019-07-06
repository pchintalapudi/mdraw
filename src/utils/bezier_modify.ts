import { Bond, BondState, LonePair, CurvedArrow, RGroup } from "@/models";

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

function shrink(start: ArrayPoint, end: ArrayPoint, dist: number, mag?: number): ArrayPoint {
    const v1 = end[0] - start[0];
    const v2 = end[1] - start[1];
    const d = dist / (mag || Math.hypot(v1, v2));
    return [start[0] + v1 * d, start[1] + v2 * d];
}

function getBondSign(bond: Bond, controlPoint: ArrayPoint, vectorPoint: ArrayPoint) {
    const x1 = bond.start.x, y1 = bond.start.y, x2 = bond.end.x, y2 = bond.end.y;
    const ax = controlPoint[0], ay = controlPoint[1], bx = vectorPoint[0] + bond.x, by = vectorPoint[1] + bond.y;
    return Math.sign(((y1 - y2) * (ax - x1) + (x2 - x1) * (ay - y1)) * ((y1 - y2) * (bx - x1) + (x2 - x1) * (by - y1)));
}

function getBondDistance(bond: Bond, leading: boolean) {
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

function lonePairPoints(lonePair: LonePair, curves: BezierCurve[], leading: boolean): [ArrayPoint, ArrayPoint] {
    const lonePairDist = leading ? 5 : 10;
    const curve = curves[leading ? 0 : curves.length - 1];
    const pi = leading ? 0 : 3, ci = leading ? 1 : 2;
    const point = shrink(curve[pi], [lonePair.rgroup.x, lonePair.rgroup.y], -lonePairDist);
    if (curves.length === 1) return leading ? [point, curve[ci]] : [curve[ci], point];
    const dist = Math.hypot(curve[ci][0] - point[0], curve[ci][1] - point[1]);
    const control = dist * 2 < lonePairDist ? curve[ci]
        : shrink(curve[pi], point, dist, lonePairDist);
    return leading ? [point, control] : [control, point];
}

function bondPoints(bond: Bond, curves: BezierCurve[], leading: boolean): [ArrayPoint, ArrayPoint] {
    const bondDist = getBondDistance(bond, leading);
    const pi = leading ? 0 : 3, ci = leading ? 1 : 2;
    const curve = curves[leading ? 0 : curves.length - 1];
    const pvx = bond.end.y - bond.start.y, pvy = bond.start.x - bond.end.x;
    if (curves.length < 2) {
        const sign = getBondSign(bond, curve[3 - pi], [pvx, pvy]);
        const point = shrink(curve[0], [pvx * sign + bond.x, pvy * sign + bond.y], bondDist);
        return leading ? [point, curve[ci]] : [curve[ci], point];
    } else {
        const dist = getBondDistance(bond, leading);
        const sign = getBondSign(bond, curve[ci], [pvx, pvy]);
        const point = shrink(curve[pi], [pvx * sign + bond.x, pvy * sign + bond.y], dist);
        const cdist = Math.hypot(curve[ci][0] - point[0], curve[ci][1] - point[1]);
        if (cdist < dist) return leading ? [point, curve[ci]] : [curve[ci], point];
        const cp = shrink(curve[pi], point, cdist, bondDist);
        return leading ? [point, cp] : [cp, point];
    }
}

function adjustStart(bezierCurves: BezierCurve[], curvedArrow: CurvedArrow) {
    const curve = bezierCurves[0];
    const p0 = curvedArrow.points[0];
    if (p0 instanceof RGroup) {
        curve.splice(0, 1, shrink(curve[0], curve[bezierCurves.length > 1 ? 1 : 3], p0.radius));
    } else if (p0 instanceof LonePair) {
        curve.splice(0, 2, ...lonePairPoints(p0, bezierCurves, true));
    } else if (p0 instanceof Bond) {
        curve.splice(0, 2, ...bondPoints(p0, bezierCurves, true));
    }
}

function adjustEnd(bezierCurves: BezierCurve[], curvedArrow: CurvedArrow) {
    const curve = bezierCurves[bezierCurves.length - 1];
    const p0 = curvedArrow.points[curvedArrow.points.length - 1];
    if (p0 instanceof RGroup) {
        curve.splice(3, 1, shrink(curve[3], curve[bezierCurves.length > 1 ? 2 : 0], p0.radius + 5));
    } else if (p0 instanceof LonePair) {
        curve.splice(2, 2, ...lonePairPoints(p0, bezierCurves, false));
    } else if (p0 instanceof Bond) {
        curve.splice(2, 2, ...bondPoints(p0, bezierCurves, false));
    }
}

export function adjustCurve(bezierCurves: BezierCurve[], curvedArrow: CurvedArrow) {
    adjustStart(bezierCurves, curvedArrow);
    adjustEnd(bezierCurves, curvedArrow);
}
