import element_array from './elements';
export * from './rgroups';
export * from './bonds';

export function element(atomicNumber: number) {
    return element_array[atomicNumber - 1];
}
