<template>
  <div class="root" @click.stop="$emit('dialog-close')">
    <slot @cascade="cascade"></slot>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  methods: {
    cascade({ name, payload }: { name: string; payload: any }) {
      this.$emit(name, payload);
    }
  }
});
</script>
<style scoped>
.root {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #00000044;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
