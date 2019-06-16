import StateVariables from "../state_variables";
import { RGroup, Bond, StraightArrow, CurvedArrow } from "../../models";
function getValidBonds(rgroups: RGroup[]) {
    const rgroupSet = new Set<RGroup>(rgroups);
    const bonds = new Set<Bond>();
    for (const rgroup of rgroups) {
        rgroup.bonds.forEach((b, r) => {
            if (rgroupSet.has(r) && !bonds.has(b)) {
                bonds.add(b);
            }
        });
    }
    return Array.from(bonds);
}
export function save(vars: StateVariables, full = true) {
    if (full) {
        return `${vars.rgroups.map(r => r.serialize()).join()}!${vars.bonds.map(b => b.serialize()).join()}!
        ${vars.straightArrows.map(s => s.serialize()).join()}!${vars.curvedArrows.map(c => c.serialize()).join()}`;
    } else {
        const rgroups = vars.selected.filter(s => s instanceof RGroup) as RGroup[];
        const bonds = getValidBonds(rgroups);
        return `${rgroups.map(r => r.serialize()).join()}!${bonds.map(b => b.serialize()).join()}`;
    }
}
