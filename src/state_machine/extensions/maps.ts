import { RGroup, Bond, StraightArrow, CurvedArrow } from "@/models";
import { Rectangle } from "@/utils";

// tslint:disable-next-line: max-classes-per-file
export class MapStruct {

    private static empty = [0, 0, 0, 0];

    public zoomFactor = 1;
    public viewPort = new Rectangle(0, 0, window.innerWidth, window.innerHeight);

    constructor(private rgroups: RGroup[], private bonds: Bond[],
        // tslint:disable-next-line: align
        private straightArrows: StraightArrow[], private curvedArrows: CurvedArrow[]) {
    }

    private get rgroupBox() {
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

    private get straightArrowBox() {
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

    private get curvedArrowBox() {
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

    private get bondBox() {
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

    get bounds() {
        const boxes = [this.rgroupBox, this.straightArrowBox, this.curvedArrowBox, this.bondBox];
        const startX = Math.min(...boxes.map(b => b[0])), startY = Math.min(...boxes.map(b => b[1])),
            endX = Math.max(...boxes.map(b => b[2])), endY = Math.max(...boxes.map(b => b[3]));
        return new Rectangle(startX, startY, endX - startX, endY - startY);
    }

    get viewBox() {
        const minbox = this.bounds;
        const startX = Math.min(0, minbox.x), startY = Math.min(0, minbox.x),
            endX = Math.max(this.viewPort.width, minbox.ex), endY = Math.max(this.viewPort.height, minbox.ey);
        return new Rectangle(startX, startY, endX - startX, endY - startY);
    }
}
