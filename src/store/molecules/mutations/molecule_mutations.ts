import { StateType } from "../state";
import { RGroup, DrawerState, Bond, elements, Payload } from "../../../models";
import { defaultBondDist } from "../../../constants";

let moleculeMutations = {
  setAtomicNumber(state: StateType, number: number) {
    state.atomicNumber = number;
  },
  createRGroup({ stateMachine, rgroups }: StateType, rgroup: RGroup) {
    if (stateMachine.state == DrawerState.IDLE) {
      stateMachine.placing = rgroup;
      rgroups.push(rgroup);
      stateMachine.state = DrawerState.PLACING_NEW_ATOM;
      console.log([...rgroups]);
    }
  },
  cancelRGroupCreation({ rgroups }: StateType) {
    rgroups.pop();
  },
  createBond({ rgroups, bonds, stateMachine }: StateType, start: RGroup) {
    if (stateMachine.state == DrawerState.IDLE) {
      let carbon = new RGroup(elements[6 - 1]);
      carbon.x = defaultBondDist + start.x;
      carbon.y = start.y;
      stateMachine.placing = carbon;
      rgroups.push(carbon);
      let bond: Bond = new Bond(start, carbon);
      stateMachine.adding = bond;
      bonds.push(bond);
      stateMachine.state = DrawerState.PLACING_NEW_ATOM_AND_BOND;
      start.bonds.set(bond.id, bond);
      carbon.bonds.set(bond.id, bond);
    }
  },
  cancelBondCreation({ rgroups, bonds }: StateType) {
    rgroups.pop();
    bonds.pop();
  },
  startMove({ pointerState, stateMachine }: StateType, rgroup: RGroup) {
    if (stateMachine.state == DrawerState.IDLE) {
      pointerState.initTime = Date.now();
      stateMachine.state = DrawerState.MOVING_ATOM;
      stateMachine.placing = rgroup;
      pointerState.start = { x: rgroup.x, y: rgroup.y };
    }
  },
  logInitPoint({ pointerState }: StateType, init: { x: number; y: number }) {
    pointerState.start = init;
  },
  cancelMove({ stateMachine, pointerState }: StateType) {
    stateMachine.placing!.x = pointerState.start!.x;
    stateMachine.placing!.y = pointerState.start!.y;
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
  },
  swapPayload(
    _: StateType,
    { rgroup, payload }: { rgroup: RGroup; payload: Payload }
  ) {
    rgroup.payload = payload;
  },
  swapBond(_: StateType, { rgroup, bond }: { rgroup: RGroup; bond: Bond }) {
    rgroup.bonds.set(bond.id, bond);
    bond.end = rgroup;
  },
  omit(state: StateType, omit: boolean) {
    state.omitting = omit;
  }
};

export default moleculeMutations;
