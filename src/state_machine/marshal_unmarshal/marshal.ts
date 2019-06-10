import StateVariables from "../state_variables";
import { RGroup, Bond } from "../../models";
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
export function save(vars: StateVariables) {
    //Save
    return "";
}
