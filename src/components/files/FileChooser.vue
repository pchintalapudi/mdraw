<template>
  <div class="die" @click.stop="$emit('close', [false, ''])">
    <div @click.stop>
      <div class="top">
        <row-vue
          v-for="(name, idx) in fileNames"
          :key="name || idx"
          :type="name ? 'R' : ''"
          :name="name"
          :selected="fileName && name === fileName"
          @select="fileName=name"
          @open="deal()"
          @focus="fileName=name"
          tabindex="0"
          @keydown.delete="deleteFile"
        ></row-vue>
      </div>
      <div class="bottom">
        <input
          type="text"
          name="fileName"
          id="fileName"
          v-model="fileName"
          @keydown.enter="deal(false)"
        >
        <button v-if="!save" @click="$emit('new-file')">New</button>
        <button @click="deal(false)">{{save ? "Save" : "Open"}}</button>
        <button @click="$emit('close', [false, ''])">Cancel</button>
      </div>
      <dialog-vue
        v-if="message"
        v-bind="message"
        @affirm="dialog(true)"
        @deny="dialog(false)"
        @cancel="cancel()"
      ></dialog-vue>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import RowVue from "./Row.vue";
import DialogVue from "./Dialog.vue";
import { getFiles, saveFile, loadFile, deleteFile } from "../../files";
export default Vue.extend({
  props: { save: String },
  components: { "row-vue": RowVue, "dialog-vue": DialogVue },
  data() {
    return {
      fileNames: ["", "", "", "", "", "", "", "", "", ""] as string[],
      fileName: "",
      message: undefined as
        | undefined
        | {
            header: string;
            message: string;
            affirmations: string[];
            denials: string[];
          }
    };
  },
  computed: {
    validFiles(): string[] {
      return this.fileNames.filter((n: string) => n.includes(this.fileName));
    }
  },
  mounted() {
    const ret = getFiles();
    if (typeof ret === "string") {
      this.message = {
        header: "File Access Error",
        message: ret,
        affirmations: [],
        denials: ["Ok"]
      };
    } else {
      for (
        this.fileNames = ret;
        this.fileNames.length < 10;
        this.fileNames.push("")
      );
    }
  },
  methods: {
    deal(override = false) {
      if (this.save) {
        if (this.fileName) {
          const ret = saveFile(this.fileName, this.save, override);
          if (ret) {
            this.message = {
              header: "Confirm Save",
              message: `${
                this.fileName
              } already exists. Do you want to overwrite it?`,
              affirmations: ["Yes"],
              denials: ["No"]
            };
          } else {
            this.$emit("close", [true, this.fileName]);
          }
        }
      } else {
        if (
          this.fileName &&
          (this.validFiles.includes(this.fileName) ||
            (this.validFiles.length === 1 && this.fileName))
        ) {
          this.$emit("close", [true, this.fileName]);
        } else {
          this.message = {
            header: "Select File",
            message: "Please select a valid file",
            affirmations: ["Ok"],
            denials: []
          };
        }
      }
    },
    dialog(response: boolean) {
      switch (this.message!.header) {
        case "Confirm Save":
          if (response) {
            this.deal(true);
          }
          break;
        case "File Access Error":
          this.$emit("close", [false, ""]);
          break;
        case "Select File":
          break;
        case "Delete File":
          if (response) {
            deleteFile(this.message!.header);
          }
          break;
      }
      this.message = undefined;
    },
    deleteFile() {
      this.message = {
        header: "Delete File",
        message: `Are you sure you want to delete ${this.fileName}?`,
        affirmations: ["Delete"],
        denials: ["Cancel"]
      };
    }
  }
});
</script>
<style scoped>
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
  top: 10%;
  left: 10%;
  right: 10%;
  bottom: 10%;
  display: flex;
  flex-flow: column nowrap;
  background-color: white;
}
.top {
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: auto;
}
.bottom {
  padding: 20px;
  flex: 0;
  justify-content: center;
  align-items: center;
  margin-left: auto;
}
.bottom > * {
  flex: 0;
}
.bottom > input {
  flex: 1;
}
</style>
