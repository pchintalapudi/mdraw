<template>
  <section :class="save? 'filechooser save' : 'filechooser load'">
    <article
      v-for="file in fileNames"
      :key="file"
      :class="selected === file ? 'file selected' : 'file'"
    >{{file}}</article>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: {
    fileNames: [] as string[],
    selected: ""
  },
  computed: {
    save(): boolean {
      return this.$store.state.files.save;
    }
  },
  async mounted() {
    this.fileNames = await this.$store.dispatch("files/getNames");
  }
});
</script>
