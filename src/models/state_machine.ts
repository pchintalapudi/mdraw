import { RGroup, Bond } from "./infrastructure";
enum DrawerState {
  PLACING_NEW_ATOM,
  PLACING_NEW_ATOM_AND_BOND,
  MOVING_SELECTED,
  SELECTED,
  IDLE
}

class StateMachine {
  private _state: DrawerState = DrawerState.IDLE;
  selected: RGroup[] = [];
  private _creating?: RGroup = undefined;
  adding?: Bond = undefined;

  get creating() {
    return this._creating;
  }

  set creating(rgroup: RGroup | undefined) {
    this._creating = rgroup;
    if (rgroup && this.selected.indexOf(rgroup) !== -1)
      this.selected.push(rgroup);
  }

  get state() {
    return this._state;
  }
  set state(state: DrawerState) {
    switch (state) {
      case DrawerState.IDLE:
        // console.log("idle");
        break;
      case DrawerState.MOVING_SELECTED:
        // console.log("moving");
        break;
      case DrawerState.PLACING_NEW_ATOM:
        // console.log("atom");
        break;
      case DrawerState.PLACING_NEW_ATOM_AND_BOND:
        // console.log("bond");
        break;
      case DrawerState.SELECTED:
        // console.log("selected");
        break;
      case DrawerState.MOVING_SELECTED:
        // console.log("moving_selected");
        break;
    }
    this._state = state;
  }
}

export { DrawerState, StateMachine };
