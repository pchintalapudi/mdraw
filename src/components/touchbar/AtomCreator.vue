<template>
  <form name="atom-creator" class="atom-creator">
    <div>
      <toggle-button
        v-for="(element, idx) in recent"
        :key="element.number"
        @toggle-button="create(element)"
        :on="on && !idx"
        viewBox="-5 -5 10 10"
        overflow="visible"
        class="atom-picture"
      >
        <title>{{element.name}}</title>
        <circle
          cx="0"
          cy="0"
          r="5"
          :fill="d3 ? `url(#color${colors[idx]}-gradient)` : 'transparent'"
          :stroke="d3 ? 'transparent' : 'black'"
          stroke-width="0.5"
        ></circle>
        <text
          text-anchor="middle"
          dominant-baseline="central"
          font-size="5.75"
          :fill="d3 ? 'white' : 'black'"
          :stroke="d3 ? 'black' : 'transparent'"
          stroke-width="0.25"
        >{{element.abbrev}}</text>
      </toggle-button>
    </div>
    <select name="atom-selector" id="atom-selector" v-model="selected" title="Select an element">
      <option
        v-for="el in $options.choices"
        :key="el.number"
        :value="el"
      >{{`${el.number} ${el.name} (${el.abbrev})`}}</option>
    </select>
  </form>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import ToggleButtonVue from "./ToggleButton.vue";
import { ChemicalElement } from "@/models";
import { State, StateMachine, Action } from "@/state_machine";
import { getColor } from "@/models";
import elements from "@/models/elements";
export default Vue.extend({
  components: { "toggle-button": ToggleButtonVue },
  created() {
    (this.$options as any).choices = elements;
  },
  props: {
    stateMachine: StateMachine,
    d3: Boolean
  },
  data() {
    return {
      recentlyUsed: [elements[5]],
      selected: elements[5]
    };
  },
  computed: {
    recent(): ChemicalElement[] {
      const rev = [];
      let i = this.recentlyUsed.length - 1;
      do {
        rev.push(this.recentlyUsed[i]);
      } while (i--);
      return rev;
    },
    on(): boolean {
      return this.stateMachine.state === State.PLACING_ATOM;
    },
    colors(): string[] {
      return this.recent.map(e => getColor(e.name));
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
      this.stateMachine.execute(Action.BUTTON, {
        target: "spawn",
        payload: { name: this.selected.name, abbrev: this.selected.abbrev }
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
