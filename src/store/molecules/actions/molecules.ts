import { ActionContext } from "vuex";
import { StateType } from "../state";
import {
  DrawerState,
  BondState,
  Bond,
  RGroup,
  elements
} from "../../../models";
import calculateAngle from "./angles";
import { defaultBondDist } from "../../../constants";

let actions = {
  defaultCancel({ state, commit }: ActionContext<StateType, any>) {
    switch (state.stateMachine.state) {
      default:
      case DrawerState.IDLE:
      case DrawerState.SELECTING:
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
      case DrawerState.SELECTING:
        commit("cancelSelecting");
    }
    commit("clearStateMachine");
    commit("clearPointerState");
  },
  createAtom({ state, commit }: ActionContext<StateType, any>) {
    if (state.atomicNumber > 0 && state.atomicNumber <= elements.length)
      commit("createRGroup", new RGroup(elements[state.atomicNumber - 1]));
  },
  moveEvent(
    { state }: ActionContext<StateType, any>,
    { x, y, force }: { x: number; y: number; force?: boolean }
  ) {
    switch (state.stateMachine.state) {
      case DrawerState.IDLE:
      default:
        break;
      case DrawerState.MOVING:
        if (state.stateMachine.isSelected)
          state.stateMachine.selected.forEach(r => {
            r.x = x;
            r.y = y;
          });
        else {
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
        } else {
          let start = state.stateMachine.adding!.start,
            end = state.stateMachine.creating!,
            angle = calculateAngle(
              defaultBondDist,
              (180 / Math.PI) * Math.atan2(x - start.x, y - start.y) - 90
            );
          end.x = start.x + defaultBondDist * Math.cos(angle);
          end.y = start.y + defaultBondDist * Math.sin(angle);
          break;
        }
      }
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
  }
};

export default actions;
