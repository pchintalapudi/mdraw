export class Rectangle {
    constructor(public x = 0, public y = 0, public width = 0, public height = 0) { }

    get ex() { return this.x + this.width; }

    set ex(ex: number) {
        this.width = ex - this.x;
    }

    get ey() { return this.y + this.height; }

    set ey(ey: number) {
        this.height = ey - this.y;
    }

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

    get serialized() {
        return [this.left, this.top, this.bottom - this.top, this.right - this.left];
    }
}
