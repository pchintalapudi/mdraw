import { RGroup, StraightArrow } from "@/models";
import { Rectangle, WrapperMap } from "@/utils";

interface Point { x: number; y: number; }

export class SelectionVariables {
    public selected = new WrapperMap<RGroup | StraightArrow, Point>();
    public selectionBox = new Rectangle();
}
