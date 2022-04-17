<template>
  <div class="chart" ref="rankChart"></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      myChart: null,
      startValue: 0,
      endValue: 9,
      timer: null,
      nameArr: [],
      valueArr: [],
      themeStorage:''
    };
  },
  created() {
    this.$socket.registerCallBack("rankData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    // 改造，使用websocket获取数据
    this.$socket.send({
      action: "getData",
      chartName: "rank",
      value: "",
      socketType: "rankData",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer);
    this.$socket.unRegisterCallBack("rankData");
  },
  methods: {
    // 初始化图表实例
    initChart() {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      this.myChart = this.$echarts.init(this.$refs.rankChart, this.themeStorage);
      // 初始化时候的option
      let initOption = {
        title: {
          text: "▎地区销量排行",
          top: 20,
          left: 20,
        },
        grid: {
          top: "35%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {},
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              color: (arg) => {
                let targetColor = null;
                if (arg.data >= 300) {
                  targetColor = colorArr[0];
                } else if (arg.data >= 200) {
                  targetColor = colorArr[1];
                } else {
                  targetColor = colorArr[2];
                }
                return {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: targetColor[0] },
                    { offset: 1, color: targetColor[1] },
                  ],
                };
              },
            },
          },
        ],
      };
      this.myChart.setOption(initOption);
      // 鼠标移入取消动效
      this.myChart.on("mouseover", () => {
        clearInterval(this.timer);
      });
      // 鼠标移出开始动效
      this.myChart.on("mouseout", () => {
        this.startInterval();
      });
    },
    // 获取后台数据,并处理数据，更新图表
    async getData(data) {
      // const { data } = await this.$http.get("/rank");
      data.sort((a, b) => {
        return b.value - a.value;
      });
      // 处理数据
      this.valueArr = data.map((item) => item.value);
      this.nameArr = data.map((item) => item.name);
      // 更新图表
      this.updateChart();
      // 添加动效
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      // 数据更新时的option
      let dataOption = {
        xAxis: {
          data: this.nameArr,
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: this.valueArr,
          },
        ],
      };
      this.myChart.setOption(dataOption);
    },
    // 屏幕窗口变化调用
    screenAdapter() {
      // 利用盒子宽度来算出柱子宽度等
      let chartWidth = (this.$refs.rankChart.offsetWidth / 100) * 3.6;
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: chartWidth / 1.2,
          },
        },
        series: [
          {
            barWidth: chartWidth,
            itemStyle: {
              barBorderRadius: [chartWidth / 2, chartWidth / 2, 0, 0],
            },
          },
        ],
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    // 动效效果
    startInterval() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.startValue++, this.endValue++;
        if (this.endValue == this.nameArr.length) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 3000);
    },
  },
  computed: {
    ...mapState({
      theme: function (state) {
        this.themeStorage = sessionStorage.getItem("theme") || "chalk";
        return state.theme;
      },
    }),
  },
  watch: {
    theme() {
      this.themeStorage = sessionStorage.getItem("theme") || "chalk";
      this.myChart.dispose();
      this.initChart();
      this.updateChart();
      this.screenAdapter();
    },
  },
};
</script>

<style lang="less" scoped>
</style>