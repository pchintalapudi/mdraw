import { RGroup } from "@/models";
import { IDGenerator } from "./globals";
class LonePair {
    constructor(public rgroup: RGroup, public count: number,
                public angle: number = 0, public id = IDGenerator.nextID) { }

    public serialize() {
        return `${this.id}*${this.count}*${this.angle}`;
    }

    // tslint:disable-next-line: member-ordering
    public static deserialize(str: string, rg: RGroup): [number, LonePair] {
        const parts = str.split("*");
        return [+parts[0], new LonePair(rg, +parts[1], parseFloat(parts[2]))];
    }

    get x() {
        return this.rgroup.x + 15 * Math.cos(this.angle * Math.PI / 180);
    }

    get y() {
        return this.rgroup.y - 15 * Math.sin(this.angle * Math.PI / 180);
    }
}

export { LonePair };
