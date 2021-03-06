enum State {
    PLACING_ATOM,
    PLACING_ATOM_AND_BOND,
    PLACING_LONE_PAIR,
    ANGLING_LONE_PAIR,
    PLACING_STRAIGHT_ARROW,
    ANGLING_STRAIGHT_ARROW,
    PLACING_CURVED_ARROW,
    DRAWING_CURVED_ARROW,
    MOVING_ATOM,
    SELECTING,
    ROTATING,
    MAPPING,
    PANNING,
    IDLE,
    __COUNT__,
}

export default State;
