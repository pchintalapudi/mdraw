import bezierSpline from "@freder/bezier-spline";
import { IDGenerator } from "./globals";
import { RGroup, Bond } from "@/models";
import { bondControlPoint, ArrayPoint, BezierCurve, deepCopy, getBondDistance, shrink } from "@/utils";
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
                        [this.points[1].x, this.points[1].y],
                        [this.points[0].x, this.points[0].y],
                        [this.points[1].x, this.points[1].y]
                    ]
                ] as BezierCurve[])
                : deepCopy(this.computedCurve);
        if (this.points[0] instanceof RGroup) {
            rawCurve[0].splice(
                0,
                1,
                shrink(
                    rawCurve[0][0],
                    rawCurve[0][1],
                    (this.points[0] as RGroup).payload.abbrev.length === 1
                        ? 10
                        : 15
                )
            );
        } else if (this.points[0] instanceof Bond) {
            const cp = bondControlPoint(rawCurve[0][1], this.points[0] as Bond);
            rawCurve[0].splice(
                0,
                2,
                shrink(
                    rawCurve[0][0],
                    cp,
                    getBondDistance(this.points[0] as Bond, true)
                ),
                cp
            );
        }
        if (this.points[this.points.length - 1] instanceof RGroup) {
            rawCurve[rawCurve.length - 1].splice(
                3,
                1,
                shrink(
                    rawCurve[rawCurve.length - 1][3],
                    rawCurve[rawCurve.length - 1][2],
                    (this.points[this.points.length - 1] as RGroup).payload
                        .abbrev.length === 1
                        ? 15
                        : 25
                )
            );
        } else if (
            this.points[this.points.length - 1] instanceof Bond
        ) {
            const cp = bondControlPoint(rawCurve[rawCurve.length - 1][2], this.points[this.points.length - 1] as Bond);
            rawCurve[rawCurve.length - 1].splice(
                2,
                2,
                cp,
                shrink(
                    rawCurve[rawCurve.length - 1][3],
                    cp,
                    getBondDistance(
                        this.points[this.points.length - 1] as Bond,
                        false
                    )
                )
            );
        }
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
