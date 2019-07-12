const isWindows = window.navigator.platform.includes("Win");

export enum Modifier {
    CTRL, SHIFT, ALT, META, SHORTCUT = isWindows ? CTRL : META
}

export function getModifiers(evt: MouseEvent | KeyboardEvent) {
    let bitfield = 0;
    if (evt.ctrlKey) bitfield |= 1 << Modifier.CTRL;
    if (evt.shiftKey) bitfield |= 1 << Modifier.SHIFT;
    if (evt.altKey) bitfield |= 1 << Modifier.SHIFT;
    return bitfield;
}

export function hasModifier(bitfield: number, modifier: Modifier): boolean {
    return (bitfield & (1 << modifier)) !== 0;
}
