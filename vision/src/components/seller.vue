<template>
  <div class="chart" ref="sellerChart"></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      myChart: null,
      sellerName: [],
      sellerValue: [],
      curIndex: 0,
      totalIndex: 0,
      timer: null,
      themeStorage:''
    };
  },
  created() {
    this.$socket.registerCallBack("sellerData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    // 改造，使用websocket获取数据
    this.$socket.send({
      action: "getData",
      chartName: "seller",
      value: "",
      socketType: "sellerData",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  // 组件销毁，清空定时器
  destroyed() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("sellerData");
  },
  methods: {
    // 初始化图表实例
    initChart() {
      this.myChart = this.$echarts.init(this.$refs.sellerChart, this.themeStorage);
      // 初始化时候的option
      let initOption = {
        title: {
          text: "▎商家销售统计",
          textStyle: {
            fontSize: 66,
          },
          top: 20,
          left: 20,
        },
        grid: {
          left: "3%",
          right: "6%",
          top: "20%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              width: 66,
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            barWidth: 66,
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: "#5052EE" },
                  { offset: 1, color: "#AB6EE5" },
                ],
              },
            },
          },
        ],
      };
      this.myChart.setOption(initOption);
      // 鼠标移入，取消定时器
      this.myChart.on("mouseover", () => {
        clearInterval(this.timer);
      });
      // 鼠标移出，开启定时器
      this.myChart.on("mouseout", () => {
        this.chartSetInterval();
      });
    },
    // 获取后台数据,并处理数据，更新图表
    getData(data) {
      // const { data } = await this.$http.get("/seller");
      // 处理数据，一页展示5条数据
      data.sort((a, b) => a.value - b.value);
      let name = data.map((item) => item.name);
      let value = data.map((item) => item.value);
      this.totalIndex = Math.ceil(data.length / 5);
      for (let i = 0; i < this.totalIndex; i++) {
        this.sellerName.push(name.slice(i * 5, (i + 1) * 5));
        this.sellerValue.push(value.slice(i * 5, (i + 1) * 5));
      }
      // 更新图表
      this.updateChart();
      // 开启动效
      this.chartSetInterval();
    },
    // 更新图表
    updateChart() {
      let showName = this.sellerName[this.curIndex];
      let showValue = this.sellerValue[this.curIndex];
      // 数据更新时的option
      let dataOption = {
        yAxis: {
          data: showName,
        },
        series: [
          {
            data: showValue,
          },
        ],
      };
      this.myChart.setOption(dataOption);
    },
    // 定时更新图表数据，实现动效
    chartSetInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.curIndex++;
        if (this.curIndex == this.totalIndex) this.curIndex = 0;
        this.updateChart();
      }, 3000);
    },
    // 屏幕窗口变化调用
    screenAdapter() {
      // 利用盒子宽度来算出柱子宽度等
      let chartWidth = (this.$refs.sellerChart.offsetWidth / 100) * 3.6;
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: chartWidth,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: chartWidth,
            },
          },
        },
        series: [
          {
            barWidth: chartWidth,
            itemStyle: {
              barBorderRadius: [0, chartWidth / 2, chartWidth / 2, 0],
            },
          },
        ],
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
  },
  computed: {
    ...mapState({
      // 主题切换
      theme: function (state) {
        // 使用缓存中的主题，避免刷新主题就消失了
        this.themeStorage = sessionStorage.getItem("theme") || "chalk";
        return state.theme;
      },
    }),
  },
  watch: {
    // 主题切换
    theme() {
      this.themeStorage = sessionStorage.getItem("theme") || "charlk";
      // 需要先销毁图表才能有效
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