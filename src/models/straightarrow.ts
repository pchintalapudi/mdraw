import { IDGenerator } from "./globals";

class StraightArrow {
    constructor(public start: { x: number, y: number },
                public dist: number, public angle: number, public readonly id = IDGenerator.nextID) { }
}

export { StraightArrow };
