<template>
  <div :class="classes" @click.stop="$emit('toggle-button')">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: { on: Boolean },
  computed: {
    classes(): string[] {
      const clazzes = ["root"];
      if (this.on) clazzes.push("on");
      return clazzes;
    }
  }
});
</script>
<style scoped>
.root {
  background-color: transparent;
  transition: background-color 250ms;
}
.root.on {
  background-color: #0088ff33;
}
.root:hover {
  background-color: #0088ff44;
}
.root.on:hover {
  background-color: #0088ff66;
}
.root:active {
  background-color: #0088ff88;
}
</style>
