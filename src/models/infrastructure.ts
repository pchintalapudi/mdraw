import { PeriodicTableElement } from "./element";

let idGen = 0;

interface Payload {
  readonly name: string;
  readonly abbrev: string;
  readonly isElement: boolean;
}

interface RGroupSerialized {
  atomicNumber?: number;
  payload?: Payload;
  charge: number;
  x: number;
  y: number;
  id: number;
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

  toJSON() {
    let obj = {
      atomicNumber: undefined as number | undefined,
      payload: undefined as Payload | undefined,
      charge: this.charge,
      x: this.x,
      y: this.y,
      id: this.id
    };
    if (this.payload.isElement)
      obj.atomicNumber = (this.payload as PeriodicTableElement).atomicNumber;
    else obj.payload = this.payload;
    return obj;
  }

  contains(other: RGroup): boolean {
    let contains = false;
    this.bonds.forEach(b => (contains = contains || !!b.getPeer(other)));
    return contains;
  }
}

enum BondState {
  PARTIAL,
  SINGLE_LINEAR,
  SINGLE_APPROACHING,
  SINGLE_RECEDING,
  SINGLE_THICK,
  DOUBLE_LINEAR,
  DOUBLE_LEFT,
  DOUBLE_RIGHT,
  TRIPLE_LINEAR,
  TRIPLE_SHORT
}

interface BondSerialized {
  start: number;
  end: number;
  state: BondState;
}

class Bond {
  public start: RGroup;
  public end: RGroup;
  public state: BondState = BondState.SINGLE_LINEAR;
  public readonly id: number;

  constructor(start: RGroup, end: RGroup, id = idGen++) {
    this.start = start;
    this.end = end;
    this.id = id;
  }

  public getPeer(rgroup: RGroup) {
    return rgroup == this.start
      ? this.end
      : rgroup == this.end
      ? this.start
      : null;
  }

  public clone(): Bond {
    return new Bond(this.start, this.end, this.id);
  }

  get bondOrder(): number {
    switch (this.state) {
      default:
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

  toJSON() {
    return {
      start: this.start.id,
      end: this.end.id,
      state: this.state
    };
  }
}

export { RGroup, Bond, BondState, Payload, BondSerialized, RGroupSerialized };
