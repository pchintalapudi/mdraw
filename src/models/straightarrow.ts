//tslint:disable:variable-name
//tslint:disable:align
import { IDGenerator } from "./globals";

class StraightArrow {
    private _cos = 1;
    private _sin = 0;
    private _valid = true;

    constructor(public start: { x: number, y: number },
        private _dist: number, private _angle: number, public id = IDGenerator.nextID) { }

    get dist() {
        return this._dist;
    }

    set dist(dist: number) {
        this._dist = dist;
        this._valid = false;
    }

    get angle() {
        return this._angle;
    }

    set angle(angle: number) {
        this._angle = angle;
        this._valid = false;
    }

    private get cos() {
        return this._valid ? this._cos : this._cos = Math.cos(this._angle * Math.PI / 180);
    }

    private get sin() {
        return this._valid ? this._sin : this._sin = Math.sin(this._angle * Math.PI / 180);
    }

    get x() {
        return this.start.x + this.cos * this.dist / 2;
    }

    set x(x: number) {
        this.start.x += x - this.x;
    }

    get y() {
        return this.start.y - this.sin * this.dist / 2;
    }

    set y(y: number) {
        this.start.y += y - this.y;
    }

    public serialize() {
        return `${this.start.x}@${this.start.y}@${this._dist}@${this._angle}`;
    }

// tslint:disable-next-line: member-ordering
    public static deserialize(str: string) {
        const parts = str.split("@");
        return new StraightArrow({ x: parseFloat(parts[0]), y: parseFloat(parts[1]) },
            parseFloat(parts[2]), parseFloat(parts[3]));
    }
}

export { StraightArrow };
