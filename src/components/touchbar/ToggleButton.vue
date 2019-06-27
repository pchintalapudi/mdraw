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
      const clazzes = ["button"];
      if (this.on) clazzes.push("on");
      return clazzes;
    }
  }
});
</script>
<style scoped>
.button {
  background-color: transparent;
  transition: background-color 250ms;
}
.button.on {
  background-color: #0088ff33;
}
.button:hover {
  background-color: #0088ff44;
}
.button.on:hover {
  background-color: #0088ff66;
}
.button:active {
  background-color: #0088ff88;
}
.button>* {
  pointer-events: none;
}
</style>
