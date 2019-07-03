import { IframeIO } from "./iframe";
import { LocalIO } from "./local";

export const io = new (window.parent === window ? LocalIO : IframeIO)();

export { IframeIO, LocalIO };
