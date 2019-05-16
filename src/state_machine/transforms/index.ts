import register_pane_transforms from "./pane_transforms";
import register_atom_placement_transforms from "./atom_placement";
import register_button from "./touch_bar";
import register_move from "./move";
import register_bonds from "./bonds";
import register_lone_pairs from "./lone_pair";
import register_straight_arrows from "./straight_arrow";

function init() {
    register_pane_transforms();
    register_atom_placement_transforms();
    register_button();
    register_move();
    register_bonds();
    register_lone_pairs();
    register_straight_arrows();
}

export { init as init_transforms };
