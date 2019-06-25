<template>
  <form name="atom-creator" class="atom-creator">
    <div>
      <toggle-button
        v-for="(element, idx) in recent"
        :key="element.number"
        @toggle-button="create(element)"
        :title="element.name"
        :on="on && !idx"
        viewBox="-5 -5 10 10"
        overflow="visible"
        class="atom-picture"
      >
        <circle cx="0" cy="0" r="5" fill="transparent" stroke="black" stroke-width="0.5"></circle>
        <text text-anchor="middle" dominant-baseline="central" font-size="5.75">{{element.abbrev}}</text>
      </toggle-button>
    </div>
    <select name="atom-selector" id="atom-selector" v-model="selected">
      <option
        v-for="el in choices"
        :key="el.number"
        :value="el"
      >{{`${el.number} ${el.name} (${el.abbrev})`}}</option>
    </select>
  </form>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
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
    return {
      recentlyUsed: [elements[5]],
      selected: elements[5]
    };
  },
  computed: {
    choices(): ChemicalElement[] {
      return elements;
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
    selected(next) {
      this.$nextTick(this.spawn);
    }
  },
  methods: {
    spawn() {
      if (!this.recentlyUsed.includes(this.selected as any)) {
        this.recentlyUsed.push(this.selected as any);
        if (this.recentlyUsed.length > 6) {
          this.recentlyUsed.splice(0, 1);
        }
      } else {
        const used = [];
        for (const el of this.recentlyUsed) {
          if (el !== (this.selected as any)) used.push(el);
        }
        used.push(this.selected as any);
        this.recentlyUsed = used;
      }
      this.$emit("button-click", {
        target: "spawn",
        payload: this.selected
      });
    },
    create(el: ChemicalElement) {
      if (el === this.selected) this.spawn();
      else this.selected = el;
    }
  }
});
</script>
<style scoped>
.atom-creator {
  display: flex;
  flex-flow: column wrap;
  height: 100%;
  width: 30%;
  justify-content: space-evenly;
}
.atom-creator > :first-child {
  height: 50%;
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
