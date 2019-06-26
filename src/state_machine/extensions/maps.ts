import { RGroup, Bond, StraightArrow, CurvedArrow } from "@/models";

type BBox = [number, number, number, number];

export class MapStruct {
    public static createMapStruct(rgroups: RGroup[], bonds: Bond[],
                                  straightArrows: StraightArrow[], curvedArrows: CurvedArrow[]) {
        const ms = new MapStruct(rgroups, bonds, straightArrows, curvedArrows);
        const listener = (_: UIEvent) => {
            ms.viewWidth = window.innerWidth;
            ms.viewHeight = window.innerHeight;
        };
        window.addEventListener("resize", listener);
        return [ms, listener];
    }
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

    private get rgroupBox(): BBox {
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
        minbox[0] -= 50;
        minbox[1] -= 50;
        minbox[2] += 100;
        minbox[3] += 100;
        return minbox as BBox;
    }

    get viewBox(): BBox {
        const minbox = this.rawViewBox;
        return [Math.min(0, minbox[0]), Math.min(0, minbox[1]),
        Math.max(this.viewWidth, minbox[2]), Math.max(this.viewHeight, minbox[3])];
    }
}
