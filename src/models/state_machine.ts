import { RGroup, Bond } from "./infrastructure";
enum DrawerState {
  PLACING_NEW_ATOM,
  PLACING_NEW_ATOM_AND_BOND,
  MOVING,
  SELECTING,
  IDLE
}

class StateMachine {
  private _state: DrawerState = DrawerState.IDLE;
  selected: RGroup[] = [];
  private _creating?: RGroup = undefined;
  adding?: Bond = undefined;
  private select: boolean = false;
  private valid: boolean = false;

  get creating() {
    return this._creating;
  }

  set creating(rgroup: RGroup | undefined) {
    this._creating = rgroup;
    this.valid = false;
  }

  get isSelected() {
    if (this.valid) return this.select;
    else
      return (this.valid =
        true && (this.select = this.selected.indexOf(this._creating!) !== -1));
  }

  get state() {
    return this._state;
  }
  set state(state: DrawerState) {
    switch (state) {
      case DrawerState.IDLE:
        // console.log("idle");
        break;
      case DrawerState.MOVING:
        // console.log("moving");
        break;
      case DrawerState.PLACING_NEW_ATOM:
        // console.log("atom");
        break;
      case DrawerState.PLACING_NEW_ATOM_AND_BOND:
        // console.log("bond");
        break;
      case DrawerState.SELECTING:
        // console.log("selected");
        break;
    }
    this._state = state;
  }
}

export { DrawerState, StateMachine };
