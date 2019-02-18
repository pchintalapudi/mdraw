import { RGroup, Bond } from "./infrastructure";
enum DrawerState {
  PLACING_NEW_ATOM,
  PLACING_NEW_ATOM_AND_BOND,
  MOVING_ATOM,
  IDLE
}

class StateMachine {
  private _state: DrawerState = DrawerState.IDLE;
  placing?: RGroup = undefined;
  adding?: Bond = undefined;
  get state() {
    return this._state;
  }
  set state(state: DrawerState) {
    switch (state) {
      case DrawerState.IDLE:
        // console.log("idle");
        break;
      case DrawerState.MOVING_ATOM:
        // console.log("moving");
        break;
      case DrawerState.PLACING_NEW_ATOM:
        // console.log("atom");
        break;
      case DrawerState.PLACING_NEW_ATOM_AND_BOND:
        // console.log("bond");
        break;
    }
    this._state = state;
  }
}

export { DrawerState, StateMachine };
