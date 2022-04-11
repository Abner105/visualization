<template>
  <div id="myselelct">
    <div class="title" @click="showOption=!showOption">
      <span>{{ choiceTitle }}</span>
      <span class="icon">﹀</span>
    </div>
    <div v-show="showOption">
      <div
        class="option"
        v-for="item in options"
        :key="item.key"
        @click="changeOption(item.key)"
        v-show="!(item.key == value)"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default() {
        return []; // 接收数据格式必须为：[{key:1,text:"hahha"}]
      },
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showOption: false,
    };
  },
  computed: {
    choiceTitle() {
      let res;
      for (let i = 0; i < this.options.length; i++) {
        const item = this.options[i];
        if (item.key == this.value) res = item.text;
      }
      return res;
    },
  },
  methods: {
    changeOption(val) {
      this.$emit("input", val);
      this.showOption = false;
    },
  },
};
</script>

<style lang="less" scoped>
#myselelct {
  display: inline-block;
  padding: 5px;
  cursor: default;
  .title {
    .icon {
      display: inline-block;
      margin-left: 10px;
      padding-top:5px ;
      vertical-align:middle;
      font-weight: 100;
      cursor: pointer;
    }
  }
  .option {
    padding-top: 4px;
  }
}
</style>