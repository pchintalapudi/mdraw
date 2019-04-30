import { ActionContext } from "vuex";
import { StateType } from "../state";
import {
  DrawerState,
  BondState,
  Bond,
  RGroup,
  elements
} from "../../../models";
import { calculateAngle, rotate, getCenter } from "./angles";
import { defaultBondDist } from "../../../constants";

let actions = {
  defaultCancel({ state, commit }: ActionContext<StateType, any>) {
    switch (state.stateMachine.state) {
      default:
      case DrawerState.IDLE:
      case DrawerState.SELECTING:
        commit("clearSelected");
        return;
      case DrawerState.MOVING:
        commit("cancelMove");
        break;
      case DrawerState.PLACING_NEW_ATOM_AND_BOND:
        commit("cancelBondCreation");
        break;
      case DrawerState.PLACING_NEW_ATOM:
        commit("cancelRGroupCreation");
        break;
    }
    commit("clearStateMachine", true);
    commit("clearPointerState");
  },
  createAtom({ state, commit }: ActionContext<StateType, any>) {
    if (state.atomicNumber > 0 && state.atomicNumber <= elements.length)
      commit("createRGroup", new RGroup(elements[state.atomicNumber - 1]));
  },
  async finishRotate({
    state,
    commit,
    dispatch
  }: ActionContext<StateType, any>) {
    if (state.stateMachine.selected.length) {
      let inits = state.stateMachine.inits!;
      state.stateMachine.inits = undefined;
      let final = state.stateMachine.selected.map(r => {
        return { x: r.x, y: r.y };
      });
      let selected = [...state.stateMachine.selected];
      let maps = new Map<
        RGroup,
        { i: { x: number; y: number }; f: { x: number; y: number } }
      >();
      for (let i = 0; i < selected.length; i++) {
        maps.set(selected[i], { i: inits[i], f: final[i] });
      }
      let undo = () => {
        dispatch("defaultCancel");
        maps.forEach(({ i }, r) => {
          r.x = i.x;
          r.y = i.y;
        });
      };
      let redo = () => {
        dispatch("defaultCancel");
        maps.forEach(({ f }, r) => {
          r.x = f.x;
          r.y = f.y;
        });
      };
      commit("history/logAction", { undo, redo }, { root: true });
      commit("clearStateMachine");
      commit("clearPointerState");
    }
  },
  moveEvent(
    { state, commit }: ActionContext<StateType, any>,
    { x, y, force }: { x: number; y: number; force?: boolean }
  ) {
    switch (state.stateMachine.state) {
      case DrawerState.IDLE:
      default:
        break;
      case DrawerState.MOVING:
        if (state.stateMachine.isSelected) {
          let dx = x - state.pointerState.end!.x,
            dy = y - state.pointerState.end!.y;
          state.stateMachine.selected.forEach(r => {
            r.x += dx;
            r.y += dy;
          });
          commit("updateEnd", { x, y });
        } else {
          state.stateMachine.creating!.x = x;
          state.stateMachine.creating!.y = y;
        }
        break;
      case DrawerState.PLACING_NEW_ATOM:
        state.stateMachine.creating!.x = x;
        state.stateMachine.creating!.y = y;
        break;
      case DrawerState.PLACING_NEW_ATOM_AND_BOND: {
        if (force) {
          state.stateMachine.creating!.x = x;
          state.stateMachine.creating!.y = y;
          break;
        } else {
          let start = state.stateMachine.adding!.start,
            end = state.stateMachine.creating!,
            angle = calculateAngle(
              defaultBondDist,
              (180 / Math.PI) * Math.atan2(x - start.x, y - start.y) - 90,
              (state.stateMachine.lastAngle * 180) / Math.PI
            );
          end.x = start.x + defaultBondDist * Math.cos(angle);
          end.y = start.y + defaultBondDist * Math.sin(angle);
          break;
        }
      }
      case DrawerState.SELECTING:
        commit("updateEnd", { x, y });
        let start = state.pointerState.start!,
          end = state.pointerState.end!,
          sx = Math.min(start.x, end.x),
          sy = Math.min(start.y, end.y),
          ex = Math.max(start.x, end.x),
          ey = Math.max(start.y, end.y),
          selected = state.rgroups.filter(
            r => sx < r.x && r.x < ex && sy < r.y && r.y < ey
          );
        commit("clearSelected");
        commit("selectAllUnsafe", selected);
        break;
    }
  },
  changeBondState(
    { state, commit, dispatch }: ActionContext<StateType, any>,
    { bond, bondState }: { bond: Bond; bondState: BondState }
  ) {
    if (state.stateMachine.state == DrawerState.IDLE) {
      let prevState = bond.state,
        undo = () => {
          dispatch("defaultCancel");
          bond.state = prevState;
        },
        redo = () => {
          dispatch("defaultCancel");
          bond.state = bondState;
        };
      redo();
      commit("history/logAction", { undo, redo }, { root: true });
    }
  },
  flipBond({ commit }: ActionContext<StateType, any>, bond: Bond) {
    let swap = () => {
      let temp = bond.start;
      bond.start = bond.end;
      bond.end = temp;
    };
    swap();
    commit("history/logAction", { undo: swap, redo: swap }, { root: true });
  },
  delete({ state, commit, dispatch }: ActionContext<StateType, any>) {
    if (state.stateMachine.selected.length) {
      let rgroupCopy = [...state.rgroups],
        bondCopy = [...state.bonds],
        deletedRGroupSet = new Set([...state.stateMachine.selected]),
        deletedBondSet = new Set();
      deletedRGroupSet.forEach(r =>
        r.bonds.forEach(b => deletedBondSet.add(b))
      );
      let rgroupCleaned = rgroupCopy.filter(r => !deletedRGroupSet.has(r)),
        bondsCleaned = bondCopy.filter(b => !deletedBondSet.has(b)),
        undo = () => {
          dispatch("defaultCancel");
          commit("swapRGroups", rgroupCopy);
          commit("swapBonds", bondCopy);
          bondCopy.forEach(b => {
            if (!deletedRGroupSet.has(b.start)) {
              b.start.bonds.set(b.id, b);
            } else if (!deletedRGroupSet.has(b.end)) {
              b.end.bonds.set(b.id, b);
            }
          });
        },
        redo = () => {
          dispatch("defaultCancel");
          commit("swapRGroups", rgroupCleaned);
          commit("swapBonds", bondsCleaned);
          bondCopy.forEach(b => {
            if (!deletedRGroupSet.has(b.start)) {
              b.start.bonds.delete(b.id);
            } else if (!deletedRGroupSet.has(b.end)) {
              b.end.bonds.delete(b.id);
            }
          });
        };
      commit("history/logAction", { undo, redo }, { root: true });
      commit("clearSelected");
      redo();
    }
  }
};

export default actions;
