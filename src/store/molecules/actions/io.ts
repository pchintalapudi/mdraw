import { ActionContext } from "vuex";
import { StateType } from "../state";
import {
  RGroup,
  Bond,
  DrawerState,
  RGroupSerialized,
  BondSerialized,
  elements
} from "../../../models";
let ioActions = {
  async save({ state }: ActionContext<StateType, any>) {
    let rgroupCopy: RGroup[], bondCopy: Bond[];
    switch (state.stateMachine.state) {
      case DrawerState.IDLE:
      default:
        rgroupCopy = [...state.rgroups];
        bondCopy = [...state.bonds];
        break;
      case DrawerState.PLACING_NEW_ATOM:
        rgroupCopy = [...state.rgroups];
        rgroupCopy.pop();
        bondCopy = [...state.bonds];
        break;
      case DrawerState.PLACING_NEW_ATOM_AND_BOND:
        rgroupCopy = [...state.rgroups];
        bondCopy = [...state.bonds];
        rgroupCopy.pop();
        bondCopy.pop();
        break;
    }
    return JSON.stringify([rgroupCopy, bondCopy]);
  },
  async load(
    { state, dispatch, commit }: ActionContext<StateType, any>,
    model: string
  ) {
    let deserialized = JSON.parse(model),
      rgroupShades: RGroupSerialized[] = deserialized[0],
      bondShades: BondSerialized[] = deserialized[1],
      rgroupMap = new Map<number, number>(),
      rgroups: RGroup[] = [];
    rgroupShades.forEach(r => {
      let rgroup = new RGroup(
        r.atomicNumber ? elements[r.atomicNumber - 1] : r.payload!
      );
      rgroup.charge = r.charge;
      rgroup.x = r.x;
      rgroup.y = r.y;
      rgroupMap.set(r.id, rgroups.length);
      rgroups.push(rgroup);
    });
    let bonds: Bond[] = bondShades.map(b => {
      let bond = new Bond(
        rgroups[rgroupMap.get(b.start)!],
        rgroups[rgroupMap.get(b.end)!]
      );
      bond.start.bonds.set(bond.id, bond);
      bond.end.bonds.set(bond.id, bond);
      bond.state = b.state;
      return bond;
    });
    let undo = () => {
        dispatch("defaultCancel");
        state.rgroups.splice(
          state.rgroups.length - rgroups.length,
          rgroups.length
        );
        state.bonds.splice(state.bonds.length - bonds.length, bonds.length);
      },
      redo = () => {
        dispatch("defaultCancel");
        state.rgroups.push(...rgroups);
        state.bonds.push(...bonds);
      };
    commit("history/logAction", { undo, redo }, { root: true });
    redo();
  }
};

export default ioActions;
