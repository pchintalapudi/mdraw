import register_pane_transforms from "./PaneTransforms";
import register_atom_placement_transforms from "./AtomPlacement";
import register_button from "./Touchbar";

function init() {
    register_pane_transforms();
    register_atom_placement_transforms();
    register_button();
}

export { init as init_transforms };
