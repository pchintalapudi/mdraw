import mActions from "./molecules";
import ioActions from "./io";
import mGestures from "./gestures";

let moleculeActions = {
  ...mActions,
  ...ioActions,
  ...mGestures
};

export { moleculeActions };
