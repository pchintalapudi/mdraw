import bezierSpline from "@freder/bezier-spline";
import { IDGenerator } from "./globals";
import { Bond } from ".";
interface Point { readonly x: number; readonly y: number; id?: number; }
type ArrayPoint = [number, number];
type BezierCurve = [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint];

export class CurvedArrow {

    public rawPoints: Point[] = [];

    constructor(start: Point, end: Point, public id = IDGenerator.nextID) {
        this.rawPoints.push(start);
        this.rawPoints.push(end);
    }

    get draggablePoints() {
        return this.rawPoints.slice(1, this.rawPoints.length - 1);
    }

    get points() {
        const newPoints = [...this.rawPoints];
        if (this.rawPoints[0] instanceof Bond) {
            //Splice in the appropriate offset point
        }
        if (this.rawPoints[this.rawPoints.length - 1] instanceof Bond) {
            //Splice in the appropriate offset point
        }
        return newPoints;
    }

    get computedCurve(): BezierCurve[] {
        const val = bezierSpline.getSegments(
            bezierSpline.combinePoints(this.points.map(p => [p.x, p.y]),
                bezierSpline.getControlPoints(this.points.map(p => [p.x, p.y]))));
        return val;
    }

    public contains(point: Point) {
        return point === this.rawPoints[0] || point === this.rawPoints[this.rawPoints.length - 1];
    }

    public serialize() {
        return `
        ${this.id}@${this.rawPoints[0].id!}@${this.rawPoints[this.rawPoints.length - 1].id!}
        @${this.rawPoints.slice(0, this.rawPoints.length - 1).map(p => `${p.x}*${p.y}`).join("&")}
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
        arrow.rawPoints = pointsInternal;
        return arrow;
    }
}
