<template>
  <section class="filechooser">
    <h3 class="title">{{save ? 'Save Molecule' : 'Load Molecule'}}</h3>
    <div class="files" @keydown.delete="deleteFile">
      <article
        v-for="file in fileNames"
        :key="file"
        :class="selected === file ? 'file selected' : 'file'"
        @click="select(file)"
        @dblclick="action"
        tabindex="0"
      >{{file}}</article>
      <article v-for="(_, i) in 15 - visibleFiles.length" :key="i" class="file-fake"></article>
    </div>
    <form @submit.prevent.stop class="bbox">
      <input
        type="search"
        name="file-input"
        id="file-input"
        v-model="fileInput"
        @keydown.enter="action"
      >
      <button
        type="button"
        :disabled="(!inputValid && !save) || (save && !fileInput)"
        :title="inputValid ? '' : save ? 'Another file has the same name' : 'This file does not exist'"
        @click="action"
      >Load</button>
      <button type="button" class="cancel" @click="cancel">Cancel</button>
    </form>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: function() {
    return {
      fileInput: ""
    };
  },
  computed: {
    fileNames(): string[] {
      return this.$store.state.files.fileNames;
    },
    save(): boolean {
      return this.$store.state.files.save;
    },
    visibleFiles(): string[] {
      if (this.fileInput)
        return this.fileNames.filter(s => s.includes(this.fileInput));
      else return this.fileNames;
    },
    inputValid(): boolean {
      return this.save
        ? this.fileNames.indexOf(this.fileInput) != -1
        : this.visibleFiles.length != 0 || this.fileNames.length == 0;
    },
    selected(): string {
      return this.visibleFiles.indexOf(this.fileInput) != -1
        ? this.fileInput
        : "";
    }
  },
  mounted() {
    this.$store.commit("files/refreshFileNames");
  },
  methods: {
    cancel() {
      this.$store.commit("files/close");
    },
    async action() {
      if (this.save) {
        this.$store.commit("files/doSave", {
          name: this.fileInput,
          data: await this.$store.dispatch("molecules/save")
        });
        this.$store.commit("files/close");
      } else if (this.selected) {
        this.$store.dispatch(
          "molecules/load",
          await this.$store.dispatch("files/load", this.fileInput)
        );
        this.$store.commit("files/close");
      }
    },
    select(file: string) {
      this.fileInput = file;
    },
    deleteFile() {
      if (this.selected) this.$store.commit("files/deleteFile", this.selected);
    }
  }
});
</script>
<style scoped>
.filechooser {
  flex-flow: column nowrap;
  background-color: white;
}

.title {
  font-weight: normal;
  font-size: 1.5em;
  padding: 10px;
}

.files {
  flex: 1;
  flex-flow: column nowrap;
  overflow: auto;
}

.bbox {
  padding: 10px;
  background-color: lightgrey;
  border-bottom-left-radius: 1.25vmin;
  border-bottom-right-radius: 1.25vmin;
}

.bbox > * {
  padding: 5px;
  margin: 5px;
}

#file-input {
  flex: 1;
  border-radius: 5px;
}

.filechooser > * > button {
  width: 75px;
  justify-content: center;
}

.file,
.file-fake {
  height: 6.66%;
}

.file:nth-child(odd),
.file-fake:nth-child(odd) {
  background-color: #00000011;
}

.file:nth-child(even),
.file-fake:nth-child(even) {
  background-color: white;
}

.file.selected {
  background-color: #0088ff88;
}

.file:hover {
  background-color: #0088ff44;
}

.file.selected:hover {
  background-color: #0088ffbb;
}
</style>

