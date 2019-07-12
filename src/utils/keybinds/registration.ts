import { Modifier } from "./modifiers";
import { data } from "../drawer";

export type Consumer = (vmdata: ReturnType<typeof data>, ev: KeyboardEvent) => void;

type Validator = ReturnType<typeof getValidator>;

export function getValidator(...modifiers: Modifier[]) {
    const modifierSet: number = modifiers.reduce((a, b) => a | (1 << b), 0);
    return (ev: KeyboardEvent) => {
        return (!!(modifierSet & (1 << Modifier.CTRL)) === ev.ctrlKey)
            && (!!(modifierSet & (1 << Modifier.SHIFT)) === ev.shiftKey)
            && (!!(modifierSet & (1 << Modifier.ALT)) === ev.altKey)
            && (!!(modifierSet & (1 << Modifier.META)) === ev.metaKey);
    };
}

export const keybind = new Map<string, Array<[Validator, Consumer]>>();

export function registerKeybind(key: string, validator: Validator, consumer: Consumer) {
    if (!keybind.has(key)) keybind.set(key, []);
    keybind.get(key)!.push([validator, consumer]);
}
