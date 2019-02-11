import { PeriodicTableElement } from "./element";

class RGroup {
  private _payload: PeriodicTableElement;
  private _bonds = new Map<number, Bond>();
  private _charge: number = 0;
  private _x: number = 0;
  private _y: number = 0;
  public readonly id: number;
  public shouldUpdate: boolean = true;
  private static idGen: number = 0;

  constructor(payload: PeriodicTableElement) {
    this._payload = payload;
    this.id = RGroup.idGen++;
  }

  get payload() {
    return this._payload;
  }

  set payload(payload: PeriodicTableElement) {
    this._payload = payload;
    this.requestUpdate();
  }

  get bonds() {
    return this._bonds;
  }

  get charge() {
    return this._charge;
  }

  set charge(charge: number) {
    this._charge = charge;
    this.requestUpdate();
  }

  get x() {
    return this._x;
  }

  set x(x: number) {
    this._x = x;
    this.requestUpdate(true);
  }

  get y() {
    return this._y;
  }

  set y(y: number) {
    this._y = y;
    this.requestUpdate(true);
  }

  private requestUpdate(bonds = false) {
    this.shouldUpdate = true;
    if (bonds) this._bonds.forEach(val => (val.shouldUpdate = true));
  }

  public combine(other: RGroup) {
    other.bonds.forEach(val => {
      if (!val.contains(this)) {
        let bond = val.clone();
        bond.replace(other, this, false);
        bond.getPeer(this)!._bonds.set(bond.id, bond);
        this._bonds.set(bond.id, bond);
      } else {
        this._bonds.delete(val.id);
      }
    });
  }

  public uncombine(other: RGroup) {
    other.bonds.forEach(val => {
      if (!val.contains(this)) {
        this._bonds.delete(val.id);
        val.getPeer(other)!._bonds.set(val.id, val);
      } else {
        this._bonds.set(val.id, val);
      }
    });
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
  private _state: BondState = BondState.SINGLE_LINEAR;
  public shouldUpdate: boolean = true;
  public readonly id: number;
  private static idGen = 0;

  constructor(start: RGroup, end: RGroup, id = Bond.idGen++) {
    this._start = start;
    this._end = end;
    this.id = id;
  }

  get start() {
    return this._start;
  }

  set start(start: RGroup) {
    if (this._start) this._start.bonds.delete(this.id);
    this._start = start;
    start.bonds.set(this.id, this);
    this.shouldUpdate = true;
  }

  get end() {
    return this._end;
  }

  set end(end: RGroup) {
    if (this._end) this._end.bonds.delete(this.id);
    this._end = end;
    end.bonds.set(this.id, this);
    this.shouldUpdate = true;
  }

  get state() {
    return this._state;
  }

  set state(state: BondState) {
    this._state = state;
    this.shouldUpdate = true;
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
}

export {RGroup, Bond, BondState}