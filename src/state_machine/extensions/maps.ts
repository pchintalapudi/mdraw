import { RGroup, Bond, StraightArrow, CurvedArrow } from "@/models";

type BBox = [number, number, number, number];

export class MapStruct {

    private static empty: BBox = [0, 0, 0, 0];

    public zoomFactor = 1;
    public viewX = 0;
    public viewY = 0;
    public viewWidth: number;
    public viewHeight: number;

    constructor(private rgroups: RGroup[],
                private bonds: Bond[],
                private straightArrows: StraightArrow[],
                private curvedArrows: CurvedArrow[]) {
        this.viewWidth = window.innerWidth;
        this.viewHeight = window.innerHeight;
    }

    public readonly listener = (_: UIEvent) => {
        this.viewWidth = window.innerWidth;
        this.viewHeight = window.innerHeight;
    }

    private get rgroupBox(): BBox {
        if (!this.rgroups.length) return MapStruct.empty;
        let minx, miny, maxx, maxy = maxx = miny = minx = 0;
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
        let minx, miny, maxx, maxy = maxx = miny = minx = 0;
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
        let minx, miny, maxx, maxy = maxx = miny = minx = 0;
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
        let minx, miny, maxx, maxy = maxx = miny = minx = 0;
        for (const bond of this.bonds) {
            minx = Math.min(minx, bond.start.x, bond.end.x);
            miny = Math.min(miny, bond.start.y, bond.end.y);
            maxx = Math.max(maxx, bond.start.x, bond.end.x);
            maxy = Math.max(maxy, bond.start.y, bond.end.y);
        }
        return [minx - 10, miny - 10, maxx + 10, maxy + 10];
    }

    private get rawViewBox(): BBox {
        const boxes = [this.rgroupBox, this.straightArrowBox, this.curvedArrowBox, this.bondBox];
        const minbox = [Math.min(...boxes.map(b => b[0])), Math.min(...boxes.map(b => b[1])),
        Math.max(...boxes.map(b => b[2])), Math.max(...boxes.map(b => b[3]))];
        minbox[2] -= minbox[0];
        minbox[3] -= minbox[1];
        minbox[0] -= 20;
        minbox[1] -= 20;
        minbox[2] += 40;
        minbox[3] += 40;
        return minbox as BBox;
    }

    get viewBox(): BBox {
        const minbox = this.rawViewBox;
        return [Math.min(0, minbox[0]), Math.min(0, minbox[1]),
        Math.max(this.viewWidth, minbox[2]), Math.max(this.viewHeight, minbox[3])];
    }

    get viewport(): BBox {
        return [this.viewX, this.viewY, this.viewWidth, this.viewHeight];
    }
}
