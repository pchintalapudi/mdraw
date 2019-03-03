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

let copyPaste: string = "";

async function saveImpl(rgroups: RGroup[], bonds: Bond[]) {
  return JSON.stringify([rgroups, bonds]);
}

async function loadImpl(model: string) {
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
  return { rgroups, bonds };
}

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
    return saveImpl(rgroupCopy, bondCopy);
  },
  async load(
    { state, dispatch, commit }: ActionContext<StateType, any>,
    model: string
  ) {
    let { rgroups, bonds } = await loadImpl(model);
    let undo = () => {
        dispatch("defaultCancel");
        state.rgroups.length -= rgroups.length;
        state.bonds.length -= bonds.length;
      },
      redo = () => {
        dispatch("defaultCancel");
        state.rgroups.push(...rgroups);
        state.bonds.push(...bonds);
      };
    commit("history/logAction", { undo, redo }, { root: true });
    redo();
  },
  async cut({ dispatch }: ActionContext<StateType, any>) {
    dispatch("copy");
    dispatch("delete");
  },
  async copy({ state }: ActionContext<StateType, any>) {
    if (state.stateMachine.selected.length) {
      let rgroups = new Set(state.stateMachine.selected);
      let bonds = new Set<Bond>();
      rgroups.forEach(r =>
        r.bonds.forEach(b => {
          if (rgroups.has(b.start) && rgroups.has(b.end)) bonds.add(b);
        })
      );
      copyPaste = await saveImpl(Array.from(rgroups).map(r => r.filteredClone(bonds)), Array.from(bonds));
    }
  },
  async paste({ state, commit, dispatch }: ActionContext<StateType, any>) {
    if (copyPaste) {
      let { rgroups, bonds } = await loadImpl(copyPaste);
      let undo = () => {
        dispatch("defaultCancel");
        state.rgroups.length -= rgroups.length;
        state.bonds.length -= bonds.length;
      };
      let redo = () => {
        dispatch("defaultCancel");
        state.rgroups.push(...rgroups);
        state.bonds.push(...bonds);
      };
      commit("history/logAction", { undo, redo }, { root: true });
      redo();
      state.stateMachine.selected.length = 0;
      state.stateMachine.selected.push(...rgroups);
    }
  }
};

export default ioActions;
