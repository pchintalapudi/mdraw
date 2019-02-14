import { RGroup, Bond } from "./infrastructure";
enum DrawerState {
  PLACING_NEW_ATOM,
  PLACING_NEW_ATOM_AND_BOND,
  MOVING_ATOM,
  IDLE,
  JOIN_START
}

class StateMachine {
  state: DrawerState = DrawerState.IDLE;
  selection: boolean = false;
  placing?: RGroup = undefined;
  adding?: Bond = undefined;
}

export { DrawerState, StateMachine };
