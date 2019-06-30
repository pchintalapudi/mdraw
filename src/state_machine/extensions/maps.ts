import { RGroup, Bond, StraightArrow, CurvedArrow } from "@/models";

export type BBox = [number, number, number, number];

export class BoundingBox {
    constructor(public startX: number, public startY: number, public endX: number, public endY: number) { }
    get width() { return this.endX - this.startX; }
    get height() { return this.endY - this.startY; }
    get serialized(): BBox { return [this.startX, this.startY, this.width, this.height]; }
}

// tslint:disable-next-line: max-classes-per-file
export class ViewPort {
    public startX = 0;
    public startY = 0;
    public width = window.innerWidth;
    public height = window.innerHeight;

    public readonly listener = (_: UIEvent) => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    get endX() { return this.startX + this.width; }
    get endY() { return this.startY + this.height; }

    get serialized() { return [this.startX, this.startY, this.width, this.height]; }
}

// tslint:disable-next-line: max-classes-per-file
export class MapStruct {

    private static empty: BBox = [0, 0, 0, 0];

    public zoomFactor = 1;
    public viewPort = new ViewPort();

    constructor(private rgroups: RGroup[], private bonds: Bond[],
                private straightArrows: StraightArrow[], private curvedArrows: CurvedArrow[]) {
    }

    private get rgroupBox(): BBox {
        if (!this.rgroups.length) return MapStruct.empty;
        let minx, miny = minx = 30, maxx, maxy = maxx = -30;
        for (const rgroup of this.rgroups) {
            minx = Math.min(minx, rgroup.x);
            miny = Math.min(miny, rgroup.y);
            maxx = Math.max(maxx, rgroup.x);
            maxy = Math.max(maxy, rgroup.y);
        }
        return [minx - 30, miny - 30, maxx + 30, maxy + 30];
    }

    private get straightArrowBox(): BBox {
        if (!this.straightArrows.length) return MapStruct.empty;
        let minx, miny = minx = 0, maxx, maxy = maxx = 0;
        for (const sa of this.straightArrows) {
            const end = [(sa.dist + 20) * Math.cos(sa.angle * Math.PI / 180) + sa.x,
            (sa.dist + 20) * Math.sin(sa.angle * Math.PI / 180) + sa.y];
            minx = Math.min(minx, end[0], sa.start.x);
            miny = Math.min(miny, end[1], sa.start.y);
            maxx = Math.max(maxx, end[0], sa.start.x);
            maxy = Math.max(maxy, end[1], sa.start.y);
        }
        return [minx, miny, maxx, maxy];
    }

    private get curvedArrowBox(): BBox {
        if (!this.curvedArrows.length) return MapStruct.empty;
        let minx, miny = minx = 5, maxx, maxy = maxx = -5;
        for (const ca of this.curvedArrows) {
            for (const curve of ca.curve) {
                for (const point of curve) {
                    minx = Math.min(minx, point[0]);
                    miny = Math.min(miny, point[1]);
                    maxx = Math.min(maxx, point[0]);
                    maxy = Math.min(maxy, point[1]);
                }
            }
        }
        return [minx - 5, miny - 5, maxx + 5, maxy + 5];
    }

    private get bondBox(): BBox {
        if (!this.bonds.length) return MapStruct.empty;
        let minx, miny = minx = 10, maxx, maxy = maxx = -10;
        for (const bond of this.bonds) {
            minx = Math.min(minx, bond.start.x, bond.end.x);
            miny = Math.min(miny, bond.start.y, bond.end.y);
            maxx = Math.max(maxx, bond.start.x, bond.end.x);
            maxy = Math.max(maxy, bond.start.y, bond.end.y);
        }
        return [minx - 10, miny - 10, maxx + 10, maxy + 10];
    }

    get bounds(): BoundingBox {
        const boxes = [this.rgroupBox, this.straightArrowBox, this.curvedArrowBox, this.bondBox];
        const startX = Math.min(...boxes.map(b => b[0])), startY = Math.min(...boxes.map(b => b[1])),
            endX = Math.max(...boxes.map(b => b[2])), endY = Math.max(...boxes.map(b => b[3]));
        return new BoundingBox(startX, startY, endX, endY);
    }

    get viewBox(): BoundingBox {
        const minbox = this.bounds;
        const startX = Math.min(0, minbox.startX), startY = Math.min(0, minbox.startY),
            endX = Math.max(this.viewPort.width, minbox.endX), endY = Math.max(this.viewPort.height, minbox.endY);
        return new BoundingBox(startX, startY, endX, endY);
    }
}
