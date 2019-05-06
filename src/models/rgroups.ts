import element_defs from './elements';

type ChemicalElement = typeof element_defs[0];

interface Payload {
    name: string;
    symbol: string;
}

class RGroup {
    constructor(public payload: Payload, public x = 0, public y = 0, public charge = 0) { }
}

export { ChemicalElement, Payload, RGroup };
