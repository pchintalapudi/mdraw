<template>
  <div class="dialog-back" @click="escape" @keydown.escape="escape">
    <section class="dialog-area" @click="capture" tabindex="0">
      <error-dialog v-if="error"/>
      <file-dialog v-else></file-dialog>
    </section>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import ErrorDialogVue from "./ErrorDialog.vue";
import FileDialogVue from "./FileDisplay.vue";
export default Vue.extend({
  components: {
    "error-dialog": ErrorDialogVue,
    "file-dialog": FileDialogVue
  },
  data: function() {
    return { error: true };
  },
  async mounted() {
    this.error = !await this.$store.dispatch("files/canIO");
    (this.$el.children.item(0) as any).focus();
  },
  methods: {
    escape() {
      this.$store.commit("files/close");
      this.$store.state.molecules.pointerState._drawPane.focus();
    },
    capture(event: Event) {
      event.stopPropagation();
    }
  }
});
</script>
