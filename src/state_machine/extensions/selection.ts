import { RGroup, StraightArrow } from "@/models";

interface Point { x: number; y: number; }

export class SelectionVariables {
    public selected = new Map<RGroup | StraightArrow, Point>();
}
