import { Module } from "vuex";

let state = {
  undoStack: [] as Action[],
  redoStack: [] as Action[]
};

type StateType = { [P in keyof typeof state]: (typeof state)[P] };

class Action {
  undo: Function;
  redo: Function;

  constructor(undo: Function, redo: Function) {
    this.undo = undo;
    this.redo = redo;
  }
}

const module: Module<StateType, any> = {
  namespaced: true,
  state,
  mutations: {
    logAction(
      { undoStack, redoStack },
      { undo, redo }: { undo: Function; redo: Function }
    ) {
      redoStack.length = 0;
      undoStack.push(new Action(undo, redo));
    },
    undo({ undoStack, redoStack }) {
      if (undoStack.length) {
        redoStack.push(undoStack.pop()!);
        redoStack[redoStack.length - 1].undo();
      }
    },
    redo({ undoStack, redoStack }) {
      if (redoStack.length) {
        undoStack.push(redoStack.pop()!);
        undoStack[undoStack.length - 1].redo();
      }
    }
  },
  actions: {}
};

export default module;