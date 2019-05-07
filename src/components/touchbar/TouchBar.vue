<template>
  <span>
    <form name="atom-creator">
      <button type="button">Spawn Element</button>
      <select name="atom-selector" id="atom-selector">
        <optgroup label="Recently Used">
          <option
            v-for="tup in recentlyUsed"
            :key="tup[1]"
            :value="tup[1]"
          >{{`${tup[0]} (${tup[1]})`}}</option>
        </optgroup>
        <optgroup label="Other Elements">
          <option v-for="tup in choices" :key="tup[1]" :value="tup[1]">{{`${tup[0]} (${tup[1]})`}}</option>
        </optgroup>
      </select>
    </form>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { ChemicalElement, elementCount, element } from "../../models";
const abbrevToElement = new Map<string, ChemicalElement>();
const abbrevs: Array<[string, string]> = [];
for (let i = 1; i <= elementCount; i++) {
  const e = element(i);
  abbrevs.push([e.name, e.abbrev]);
  abbrevToElement.set(e.abbrev, e);
}
export default Vue.extend({
  data() {
    return { recentlyUsed: [abbrevs[5]], nameTuple: abbrevs[5] };
  },
  computed: {
    choices(): Array<[string, string]> {
      return abbrevs.filter(tup => !this.recentlyUsed.includes(tup));
    }
  }
});
</script>
