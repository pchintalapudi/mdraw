import { IframeIO } from "./iframe";
import { LocalIO } from "./local";

export default new (window.parent === window ? LocalIO : IframeIO)();

export { IframeIO, LocalIO };
