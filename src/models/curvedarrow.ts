import bezierSpline from "@freder/bezier-spline";
interface Point { x: number; y: number; }

export class CurvedArrow {

    private pointsInternal: Point[] = [];
    private valid: boolean = false;
    private bezierCurveCache: Array<[number, number]> = [];

    constructor(start: Point, end: Point) {
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

    get computedCurve() {
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

}
