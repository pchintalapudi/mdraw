import Elements from "./elements";

class PeriodicTableElement {
  readonly name: string;
  readonly abbrev: string;
  readonly mass: number;
  readonly period: number;
  readonly group: number;
  readonly atomicNumber: number;
  readonly shells: number[];
  readonly isElement: boolean;

  constructor(obj: any) {
    this.name = obj.name;
    this.abbrev = obj.symbol;
    this.isElement = true;
    this.mass = obj.atomic_mass;
    this.period = obj.period;
    this.group = obj.xpos;
    this.atomicNumber = obj.number;
    this.shells = obj.shells;
  }
}

function initElements(): PeriodicTableElement[] {
  let implArr: PeriodicTableElement[] = [];
  Elements.elements.forEach(e => implArr.push(new PeriodicTableElement(e)));
  return implArr;
}

let elements = initElements();

export { elements, PeriodicTableElement };
