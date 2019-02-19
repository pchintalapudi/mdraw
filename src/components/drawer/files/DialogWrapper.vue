<template>
  <div class="dialog-back" @click="escape">
    <section class="dialog-area" @click="capture">
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
    return { error: false };
  },
  async mounted() {
    this.error = await this.$store.dispatch("files/canIO");
  },
  methods: {
    escape() {
      console.log("escape");
      this.$store.commit("files/close");
    },
    capture(event: Event) {
      console.log("capture");
      event.preventDefault();
    }
  }
});
</script>
