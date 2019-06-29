const isWindows = window.navigator.platform.includes("Win");

export enum Modifier {
    CTRL, SHIFT, ALT, META, SHORTCUT = true ? CTRL : META
}