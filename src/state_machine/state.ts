enum State {
    PLACING_ATOM,
    PLACING_ATOM_AND_BOND,
    PLACING_LONE_PAIR,
    ANGLING_LONE_PAIR,
    MOVING_ATOM,
    SELECTING,
    ROTATING,
    IDLE,
    __COUNT__,
}

export default State;
