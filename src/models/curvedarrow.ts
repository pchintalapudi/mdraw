import bezierSpline from "@freder/bezier-spline";
import { IDGenerator } from "./globals";
import { ArrayPoint, BezierCurve, adjustCurve, deepCopy } from "@/utils";
interface Point { readonly x: number; readonly y: number; id?: number; }

export class CurvedArrow {

    public points: Point[] = [];

    constructor(start: Point, end: Point, public id = IDGenerator.nextID) {
        this.points.push(start);
        this.points.push(end);
    }

    get draggablePoints() {
        return this.points.slice(1, this.points.length - 1);
    }

    private get computedCurve(): BezierCurve[] {
        const val = bezierSpline.getSegments(
            bezierSpline.combinePoints(this.points.map(p => [p.x, p.y]),
                bezierSpline.getControlPoints(this.points.map(p => [p.x, p.y]))));
        return val;
    }

    get curve(): BezierCurve[] {
        const rawCurve =
            this.points.length === 2
                ? ([
                    [
                        [this.points[0].x, this.points[0].y],
                        [this.points[0].x, this.points[0].y],
                        [this.points[1].x, this.points[1].y],
                        [this.points[1].x, this.points[1].y]
                    ] as BezierCurve
                ])
                : deepCopy(this.computedCurve);
        adjustCurve(rawCurve, this);
        return rawCurve;
    }

    public contains(point: Point) {
        return point === this.points[0] || point === this.points[this.points.length - 1];
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
        arrow.points = pointsInternal;
        return arrow;
    }
}
