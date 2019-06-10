export class SelectionRectangle {
    constructor(public x = 0, public y = 0, public width = 0, public height = 0) { }

    get left() {
        return Math.min(this.x, this.x + this.width);
    }

    get right() {
        return Math.max(this.x, this.x + this.width);
    }

    get top() {
        return Math.min(this.y, this.y + this.height);
    }

    get bottom() {
        return Math.max(this.y, this.y + this.height);
    }

    set ex(ex: number) {
        this.width = ex - this.x;
    }

    set ey(ey: number) {
        this.height = ey - this.y;
    }

    public contains(coord: { x: number, y: number }) {
        return coord.x >= this.left && coord.x <= this.right && coord.y >= this.top && coord.y <= this.bottom;
    }
}
