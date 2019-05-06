import element_array from './elements';
import { RGroup, ChemicalElement, Payload } from './rgroups';
import { Bond, BondState } from './bonds';

function element(atomicNumber: number) {
    return element_array[atomicNumber - 1];
}

export { element, RGroup, ChemicalElement, Payload, Bond, BondState };
