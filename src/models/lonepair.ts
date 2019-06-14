import { RGroup } from "@/models";
import { IDGenerator } from "./globals";
class LonePair {
    constructor(public rgroup: RGroup, public count: number,
                public angle: number = 0, public id = IDGenerator.nextID) { }

    public serialize() {
        return `${this.count}*${this.angle}`;
    }

    // tslint:disable-next-line: member-ordering
    public static deserialize(str: string, rg: RGroup) {
        return new LonePair(rg,
            +str.substring(0, str.indexOf("*")),
            parseFloat(str.substring(str.indexOf("*") + 1)));
    }
}

export { LonePair };
