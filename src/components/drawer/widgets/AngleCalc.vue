<template>
  <article id="angle-calc">
    <form>
      <label for="offset">Offset Angle</label>
      <input type="number" name="offset" id="offset" v-model="offset" min="-360" max="360" step="5">
      <label for="sides">Sides in Polygon</label>
      <input type="number" name="sides" id="sides" v-model="sideCount" min="3" max="20">
    </form>
    <svg :style="'transform:rotate(' + realOffset + 'deg)'" viewBox="0 0 100 100">
      <polygon :points="points"></polygon>
      <text v-for="obj in annotations" :key="obj.style" :style="obj.style">{{obj.text}}</text>
    </svg>
  </article>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: function() {
    return {
      offset: 0,
      sideCount: 3
    };
  },
  computed: {
    points() {
      let points = [],
        size = 40;
      for (let i = 0; i < this.sideCount; i++) {
        let str = "";
        str += this.calcX(i);
        str += ",";
        str += this.calcY(i);
        points.push(str);
      }
      return points.join(" ");
    },
    annotations() {
      let texts: { style: string; text: string }[] = [];
      for (let i = 0; i < this.sideCount; i++) {
        texts.push({
          style:
            "transform:translate(" +
            this.calcX(i) +
            "px, " +
            this.calcY(i) +
            "px) rotate(" +
            -this.realOffset +
            "deg);fill:white",
          text:
            Number(
              (
                (this.realOffset + (i * 360) / this.sideCount + 360) %
                360
              ).toFixed(2)
            ) + ""
        });
      }
      return texts;
    },
    realOffset(): number {
      return (Number(this.offset) + 360) % 360 || 0;
    }
  },
  methods: {
    calcX(side: number) {
      return 50 + 40 * Math.sin((2 * Math.PI * side) / this.sideCount);
    },
    calcY(side: number) {
      return 50 + 40 * Math.cos((2 * Math.PI * side) / this.sideCount);
    }
  }
});
</script>
