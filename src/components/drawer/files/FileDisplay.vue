<template>
  <section class="filechooser">
    <h3>{{save ? 'Save Molecule' : 'Load Molecule'}}</h3>
    <div>
      <article
        v-for="file in fileNames"
        :key="file"
        :class="selected === file ? 'file selected' : 'file'"
        @click="select(file)"
        @dblclick="action"
      >{{file}}</article>
      <article v-for="(_, i) in 15 - visibleFiles.length" :key="i" class="file-fake"></article>
    </div>
    <form @submit.prevent.stop>
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
      fileNames: [] as string[],
      fileInput: ""
    };
  },
  computed: {
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
  async mounted() {
    this.fileNames = await this.$store.dispatch("files/getNames");
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
    }
  }
});
</script>
