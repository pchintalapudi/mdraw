//tslint:disable:variable-name
//tslint:disable:align
import { IDGenerator } from "./globals";

class StraightArrow {

    constructor(public start: { x: number, y: number },
        public dist: number, public angle: number, public id = IDGenerator.nextID) { }

    get x() {
        return this.start.x + Math.cos(this.angle * Math.PI / 180) * this.dist / 2;
    }

    set x(x: number) {
        this.start.x += x - this.x;
    }

    get y() {
        return this.start.y + Math.sin(this.angle * Math.PI / 180) * this.dist / 2;
    }

    set y(y: number) {
        this.start.y += y - this.y;
    }

    public serialize() {
        return `${this.start.x}@${this.start.y}@${this.dist}@${this.angle}`;
    }

// tslint:disable-next-line: member-ordering
    public static deserialize(str: string) {
        const parts = str.split("@");
        return new StraightArrow({ x: parseFloat(parts[0]), y: parseFloat(parts[1]) },
            parseFloat(parts[2]), parseFloat(parts[3]));
    }
}

export { StraightArrow };
