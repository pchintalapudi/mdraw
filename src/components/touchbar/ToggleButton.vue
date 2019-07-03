<template>
  <svg :class="classes" @click.stop="$emit('toggle-button')">
    <slot></slot>
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: { on: Boolean },
  computed: {
    classes(): string[] {
      const clazzes = ["toggle-button"];
      if (this.on) clazzes.push("on");
      return clazzes;
    }
  }
});
</script>
<style scoped>
.toggle-button {
  background-color: transparent;
  transition: background-color 250ms;
}
.toggle-button.on {
  background-color: #0088ff33;
}
.toggle-button:hover {
  background-color: #0088ff44;
}
.toggle-button.on:hover {
  background-color: #0088ff66;
}
.toggle-button:active {
  background-color: #0088ff88;
}
.toggle-button > * {
  pointer-events: none;
}
</style>
