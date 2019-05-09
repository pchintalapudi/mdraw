import register_pane_transforms from "./pane_transforms";
import register_atom_placement_transforms from "./atom_placement";
import register_button from "./touch_bar";
import register_move from "./move";

function init() {
    register_pane_transforms();
    register_atom_placement_transforms();
    register_button();
    register_move();
}

export { init as init_transforms };
