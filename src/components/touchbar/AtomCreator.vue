<template>
  <form name="atom-creator" class="atom-creator">
    <toggle-button @toggle-button="spawn" :title="element.name" :on="on">
      <svg viewBox="-5 -5 10 10" overflow="visible" class="atom-picture">
        <circle cx="0" cy="0" r="5" fill="transparent" stroke="black" stroke-width="0.5"></circle>
        <text text-anchor="middle" dominant-baseline="central" font-size="5.75">{{element.abbrev}}</text>
      </svg>
    </toggle-button>
    <select name="atom-selector" id="atom-selector" v-model="element">
      <optgroup label="Recently Used">
        <option
          v-for="el in recent"
          :key="el.number"
          :value="el"
        >{{`${el.number} ${el.name} (${el.abbrev})`}}</option>
      </optgroup>
      <optgroup label="Other Elements">
        <option
          v-for="el in choices"
          :key="el.number"
          :value="el"
        >{{`${el.number} ${el.name} (${el.abbrev})`}}</option>
      </optgroup>
    </select>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
import ToggleButtonVue from "./ToggleButton.vue";
import { ChemicalElement, elementCount, element } from "../../models";
import { State, StateMachine } from "../../state_machine";
const elements: ChemicalElement[] = [];
for (let i = 1; i <= elementCount; i++) {
  elements.push(element(i));
}
export default Vue.extend({
  components: { "toggle-button": ToggleButtonVue },
  props: {
    stateMachine: StateMachine
  },
  data() {
    return { recentlyUsed: [elements[5]], element: elements[5] };
  },
  computed: {
    choices(): ChemicalElement[] {
      return elements.filter(el => !this.recentlyUsed.includes(el));
    },
    recent(): ChemicalElement[] {
      const rev = [];
      for (let i = this.recentlyUsed.length; i-- > 0; ) {
        rev.push(this.recentlyUsed[i]);
      }
      return rev;
    },
    on(): boolean {
      return this.stateMachine.state === State.PLACING_ATOM;
    }
  },
  watch: {
    element(next) {
      this.$nextTick(this.spawn);
    }
  },
  methods: {
    spawn() {
      if (!this.recentlyUsed.includes(this.element)) {
        this.recentlyUsed.push(this.element);
        if (this.recentlyUsed.length > 6) {
          this.recentlyUsed.splice(0, 1);
        }
      } else {
        const used = [];
        for (const el of this.recentlyUsed) {
          if (el !== this.element) used.push(el);
        }
        used.push(this.element);
        this.recentlyUsed = used;
      }
      this.$emit("button-click", {
        target: "spawn",
        payload: this.element
      });
    }
  }
});
</script>
<style scoped>
.atom-creator {
  display: flex;
  flex-flow: column wrap;
  height: 100%;
}
.atom-creator > :first-child {
  height: 50%;
  width: 25%;
  align-self: center;
  display: flex;
  justify-content: center;
}
.atom-picture {
  height: 100%;
  padding: 2.5px;
  box-sizing: border-box;
}
.atom-picture text {
  user-select: none;
}
</style>
