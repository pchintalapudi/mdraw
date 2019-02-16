import { RGroup, Bond } from "./infrastructure";
enum DrawerState {
  PLACING_NEW_ATOM,
  PLACING_NEW_ATOM_AND_BOND,
  MOVING_ATOM,
  IDLE
}

class StateMachine {
  state: DrawerState = DrawerState.IDLE;
  placing?: RGroup = undefined;
  adding?: Bond = undefined;
}

export { DrawerState, StateMachine };
