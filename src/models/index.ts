import element_array from "./elements";
export * from "./rgroups";
export * from "./bonds";
export * from "./selectionrectangle";
export * from "./lonepair";
export * from "./straightarrow";
export * from "./curvedarrow";
export * from "./colors";

export function element(atomicNumber: number) {
    return element_array[atomicNumber - 1];
}

const elementCount = element_array.length;

export { elementCount };
