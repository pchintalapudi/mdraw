import { Module } from "vuex";

function localStoragePresent(): boolean {
  try {
    localStorage.setItem("presence", "");
    localStorage.removeItem("presence");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function loadFiles(localStoragePresent: boolean): string[] {
  if (!localStoragePresent) return [];
  let fileNames = localStorage.getItem("fileNames");
  return fileNames ? JSON.parse(fileNames) : [];
}

let state = {
  localStoragePresent: false,
  fileNames: [] as string[],
  open: false,
  save: true
};

type StateType = { [P in keyof typeof state]: (typeof state)[P] };

let module: Module<StateType, any> = {
  namespaced: true,
  state,
  mutations: {
    doSave({ fileNames }, { name, data }: { name: string; data: string }) {
      console.log(data);
      if (!~fileNames.indexOf(name)) {
        let placed = false;
        for (let i = 0; i < fileNames.length; i++) {
          if (fileNames[i] > name) {
            fileNames.splice(i, 0, name);
            placed = true;
            break;
          }
        }
        if (!placed) fileNames.push(name);
      }
      localStorage.setItem("files/" + name, data);
    },
    openSave(state) {
      state.open = true;
      state.save = true;
      state.fileNames = loadFiles(state.localStoragePresent);
    },
    openLoad(state) {
      state.open = true;
      state.save = false;
      state.fileNames = loadFiles(state.localStoragePresent);
    },
    close(state) {
      state.open = false;
      if (state.fileNames.length)
        localStorage.setItem("fileNames", JSON.stringify(state.fileNames));
    },
    checkSave(state) {
      state.localStoragePresent =
        state.localStoragePresent || localStoragePresent();
    },
    refreshFileNames(state) {
      state.fileNames = loadFiles(state.localStoragePresent);
    },
    deleteFile({ fileNames }, fileName: string) {
      let index = fileNames.indexOf(fileName);
      if (index != -1) {
        fileNames.splice(index, 1);
        localStorage.removeItem("files/" + fileName);
        localStorage.setItem("fileNames", JSON.stringify(state.fileNames));
      }
    }
  },
  actions: {
    canIO({ state, commit }) {
      if (!state.localStoragePresent) commit("checkSave");
      return state.localStoragePresent;
    },
    getNames({ state, commit }) {
      if (state.localStoragePresent) {
        if (!state.fileNames.length) commit("refreshFileNames");
        return state.fileNames;
      }
      return [];
    },
    load(_, fileName: string) {
      return localStorage.getItem("files/" + fileName);
    }
  }
};

export default module;
