import { StateMachine } from "..";

// function deserialize(str: string, clear=false) {
//     if (!clear) {
//         const vars = deserialize(str);
//         const ilenr = this.rgroups.length;
//         const ilenb = this.bonds.length;
//         const undo = (sm: StateMachine) => {
//             sm.stateVariables.rgroups.splice(ilenr, vars[0].length);
//             sm.stateVariables.bonds.splice(ilenb, vars[1].length);
//         };
//         const redo = (sm: StateMachine) => {
//             sm.stateVariables.rgroups.push(...vars[0]);
//             sm.stateVariables.bonds.push(...vars[1]);
//         };
//         this.rgroups.push(...vars[0]);
//         this.bonds.push(...vars[1]);
//         this.log(undo, redo);
//         this.selected = vars[0];
//     } else {
//         const vars = deserialize(str);
//         const beforeRGroups = this.rgroups;
//         const beforeBonds = this.bonds;
//         const undo = (sm: StateMachine) => {
//             sm.stateVariables.rgroups = beforeRGroups;
//             sm.stateVariables.bonds = beforeBonds;
//         };
//         const redo = (sm: StateMachine) => {
//             sm.stateVariables.rgroups = vars[0];
//             sm.stateVariables.bonds = vars[1];
//         };
//         this.log(undo, redo);
//         this.rgroups = vars[0];
//         this.bonds = vars[1];
//         this.save();
//     }
// }

export function load(data: string, stateMachine: StateMachine, clear: boolean) {
    //Load
}
