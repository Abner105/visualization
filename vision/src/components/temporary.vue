<template>
  <div class="chart" ref="sellerChart"></div>
</template>

<script>
export default {
  data() {
    return {
      myChart: null,
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize",this.screenAdapter)
  },
  methods: {
    // 初始化图表实例
    initChart() {
      this.myChart = this.$echarts.init(this.$refs.sellerChart, "chalk");
      // 初始化时候的option
      let initOption = {};
      this.myChart.setOption(initOption);
    },
    // 获取后台数据,并处理数据，更新图表
    async getData() {
      const { data } = await this.$http.get("/trend");
      // 处理数据
      // 更新图表
      this.updateChart();
    },
    // 更新图表
    updateChart() {
      // 数据更新时的option
      let dataOption = {
      };
      this.myChart.setOption(dataOption);
    },
    // 屏幕窗口变化调用
    screenAdapter() {
      // 利用盒子宽度来算出柱子宽度等
      let chartWidth = (this.$refs.sellerChart.offsetWidth / 100) * 3.6;
      let adapterOption = {};
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
  },
};
</script>

<style lang="less" scoped>
</style>