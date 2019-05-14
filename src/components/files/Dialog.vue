<template>
  <div class="die" @click.stop="$emit('deny')">
    <div @click.stop>
      <span class="row">
        <p>{{header}}</p>
        <button class="button deny" @click="$emit('deny')">&times;</button>
      </span>
      <div>{{message}}</div>
      <span class="row" style="justify-content:center">
        <button
          v-for="a in affirmations"
          :key="a"
          class="button affirm"
          @click="$emit('affirm')"
        >{{a}}</button>
        <button v-for="d in denials" :key="d" class="button deny" @click="$emit('deny')">{{d}}</button>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    header: String,
    message: String,
    affirmations: Array as () => string[],
    denials: Array as () => string[]
  }
});
</script>
<style scoped>
.affirm {
  --button-color: 0%, 50%, 100%;
}
.deny {
  --button-color: 100%, 10%, 0%;
}
.button {
  background-color: transparent;
  border-color: rgb(var(--button-color));
  cursor: pointer;
  transition: background-color 250ms;
}
.button:hover {
  background-color: rgba(var(--button-color), 0.25);
}
.button:active {
  background-color: rgba(var(--button-color), 0.5);
}
.die {
  background-color: #00000088;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.die > div:first-child {
  position: fixed;
  top: 40%;
  left: 25%;
  right: 25%;
  bottom: 40%;
  display: flex;
  flex-flow: column nowrap;
  background-color: white;
}
.row {
  display: flex;
  flex-flow: row nowrap;
}
.row + div {
  text-align: center;
  flex: 1;
}
.row>p {
  flex: 1;
  text-align: center;
}
</style>
