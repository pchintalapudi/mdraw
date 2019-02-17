import { StateType } from "../state";
import { RGroup, DrawerState, Bond, elements } from "../../../models";

let moleculeMutations = {
  createRGroup({ stateMachine, rgroups }: StateType, rgroup: RGroup) {
    stateMachine.placing = rgroup;
    rgroups.push(rgroup);
    stateMachine.state = DrawerState.PLACING_NEW_ATOM;
  },
  cancelRGroupCreation({ rgroups, stateMachine }: StateType) {
    rgroups.pop();
    stateMachine.placing = undefined;
    stateMachine.state = DrawerState.IDLE;
  },
  createBond({ rgroups, bonds, stateMachine }: StateType, start: RGroup) {
    let carbon = new RGroup(elements[6 - 1]);
    stateMachine.placing = carbon;
    rgroups.push(carbon);
    let bond: Bond = new Bond(start, carbon);
    stateMachine.adding = bond;
    bonds.push(bond);
    stateMachine.state = DrawerState.PLACING_NEW_ATOM_AND_BOND;
  },
  cancelBondCreation({ rgroups, bonds, stateMachine }: StateType) {
    rgroups.pop();
    bonds.pop();
    stateMachine.adding = stateMachine.placing = undefined;
    stateMachine.state = DrawerState.IDLE;
  },
  pushRGroup({ rgroups }: StateType, rgroup: RGroup) {
    rgroups.push(rgroup);
  },
  popRGroup({ rgroups }: StateType) {
    rgroups.pop();
  },
  pushBond({ bonds }: StateType, bond: Bond) {
    bonds.push(bond);
  },
  popBond({ bonds }: StateType) {
    bonds.pop();
  }
};

export default moleculeMutations;
