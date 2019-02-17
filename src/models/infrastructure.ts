let idGen = 0;

interface Payload {
  readonly name: string;
  readonly abbrev: string;
  readonly isElement: boolean;
}

class RGroup {
  public payload: Payload;
  public bonds = new Map<number, Bond>();
  public charge: number = 0;
  public x: number = 0;
  public y: number = 0;
  public readonly id: number;

  constructor(payload: Payload, id = idGen++) {
    this.payload = payload;
    this.id = id;
  }
}

enum BondState {
  PARTIAL,
  SINGLE_LINEAR,
  SINGLE_APPROACHING,
  SINGLE_RECEDING,
  DOUBLE_LINEAR,
  DOUBLE_LEFT,
  DOUBLE_RIGHT,
  TRIPLE_LINEAR,
  TRIPLE_SHORT
}

class Bond {
  private _start: RGroup;
  private _end: RGroup;
  public state: BondState = BondState.SINGLE_LINEAR;
  public readonly id: number;

  constructor(start: RGroup, end: RGroup, id = idGen++) {
    this._start = start;
    this._end = end;
    this.id = id;
  }

  get start() {
    return this._start;
  }

  set start(start: RGroup) {
    this.setStart(start);
  }

  setStart(start: RGroup, clean = true) {
    if (clean && this._start) this._start.bonds.delete(this.id);
    this._start = start;
    start.bonds.set(this.id, this);
  }

  get end() {
    return this._end;
  }

  set end(end: RGroup) {
    this.setEnd(end);
  }

  setEnd(end: RGroup, clean = true) {
    if (clean && this._end) this._end.bonds.delete(this.id);
    this._end = end;
    end.bonds.set(this.id, this);
  }

  public getPeer(rgroup: RGroup) {
    return rgroup == this._start
      ? this._end
      : rgroup == this._end
      ? this._end
      : null;
  }

  public contains(rgroup: RGroup) {
    return rgroup == this._start || rgroup == this._end;
  }

  public replace(old: RGroup, repl: RGroup, clean = true) {
    if (this._start == old)
      if (clean) this.start = repl;
      else this._start = repl;
    else if (this._end == old)
      if (clean) this.end = repl;
      else this._end = repl;
  }

  public enforce() {
    if (this._start) this._start.bonds.set(this.id, this);
    if (this._end) this._end.bonds.set(this.id, this);
  }

  public clone(): Bond {
    return new Bond(this._start, this._end, this.id);
  }

  get bondOrder(): number {
    switch (this.state) {
      case BondState.SINGLE_LINEAR:
      case BondState.SINGLE_RECEDING:
      case BondState.SINGLE_APPROACHING:
        return 1;
      case BondState.PARTIAL:
        return 0;
      case BondState.DOUBLE_LEFT:
      case BondState.DOUBLE_LINEAR:
      case BondState.DOUBLE_RIGHT:
        return 2;
      case BondState.TRIPLE_LINEAR:
      case BondState.TRIPLE_SHORT:
        return 3;
    }
  }
}

export { RGroup, Bond, BondState, Payload };
