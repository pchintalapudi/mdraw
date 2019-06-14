import bezierSpline from "@freder/bezier-spline";
import { IDGenerator } from "./globals";
interface Point { x: number; y: number; id?: number; }
type ArrayPoint = [number, number];
type BezierCurve = [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint];

export class CurvedArrow {

    private pointsInternal: Point[] = [];
    private valid: boolean = false;
    private bezierCurveCache: BezierCurve[] = [];

    constructor(start: Point, end: Point, public id = IDGenerator.nextID) {
        this.pointsInternal.push(start);
        this.pointsInternal.push(end);
    }

    get points() {
        return this.pointsInternal;
    }

    public set(i: number, point: Point) {
        this.pointsInternal[i] = point;
    }

    public push(point: Point) {
        this.pointsInternal.push(point);
    }

    get computedCurve(): BezierCurve[] {
        if (this.valid) {
            return this.bezierCurveCache;
        } else {
            const points = [];
            for (const point of this.pointsInternal) {
                points.push([point.x, point.y]);
            }
            this.valid = true;
            return this.bezierCurveCache = bezierSpline.getSegments(
                bezierSpline.combinePoints(points, bezierSpline.getControlPoints(points)));
        }
    }

    public serialize() {
        return `
        ${this.id}@${this.points[0].id!}@${this.points[this.points.length - 1].id!}
        @${this.points.slice(0, this.points.length - 1).map(p => `${p.x}*${p.y}`).join("&")}
        `;
    }

    // tslint:disable-next-line: member-ordering
    public static deserialize(str: string, idMap: Map<number, Point>) {
        const parts = str.split("@");
        const pointsInternal: Point[] = [];
        pointsInternal.push(idMap.get(+parts[1])!);
        if (parts[3]) {
            pointsInternal.push(...parts[3].split("&").map(s => s.split("*")
                .map(f => parseFloat(f)) as ArrayPoint).map(p => ({ x: p[0], y: p[1] })));
        }
        pointsInternal.push(idMap.get(+parts[2])!);
        const arrow = new CurvedArrow(undefined as any, undefined as any);
        arrow.pointsInternal = pointsInternal;
        return arrow;
    }
}
