<template>
  <span
    @click="$emit('select')"
    @dblclick="$emit('open')"
    :class="!name ? 'disabled row' : selected ? 'selected row' : 'row'"
  >
    <p class="bold">{{type}}</p>
    {{name}}
  </span>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: { name: String, type: String, selected: Boolean }
});
</script>
<style scoped>
.bold {
  font-weight: bold;
}
.row {
  background-color: white;
  display: flex;
  flex-flow: row nowrap;
  flex: 1;
}
.row:nth-child(odd) {
  background-color: #eeeeee;
}
.selected:nth-child(n) {
  background-color: #0088ff33;
}
.row:hover {
  background-color: #0088ff44;
}
.row:active {
  background-color: #0088ff88;
}
.disabled {
  pointer-events: none;
}
</style>