<template>
  <div class="chart" ref="srockChart"></div>
</template>

<script>
export default {
  data() {
    return {
      myChart: null,
      seriesArr: [],
      curIndex: 0,
      totalPages: 0,
      timer:null
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer)
  },
  methods: {
    // 初始化图表实例
    initChart() {
      this.myChart = this.$echarts.init(this.$refs.srockChart, "chalk");
      // 初始化时候的option
      let initOption = {
        title: {
          text: "▎库存销售量",
          top: "3%",
          left: "3%",
        },
      };
      this.myChart.setOption(initOption);
      this.myChart.on('mouseover',()=>{
        clearInterval(this.timer)
      })
      this.myChart.on('mouseout',this.startInterval)
    },
    // 获取后台数据,并处理数据，更新图表
    async getData() {
      const { data } = await this.$http.get("/stock");
      // 处理数据
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colorArr = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
      ];
      this.totalPages = Math.ceil(data.length / 5);
      let temArr = data.map((item, index) => {
        index = index % 5;
        return {
          type: "pie",
          hoverAnimation: false,
          data: [
            {
              name: `${item.name}\n${item.sales}`,
              value: item.sales,
              itemStyle: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: colorArr[index][0] },
                    { offset: 1, color: colorArr[index][1] },
                  ],
                },
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
          center: centerArr[index],
          labelLine: {
            show: false,
          },
          label: {
            position: "center",
            textStyle: {
              color: colorArr[index][0],
            },
          },
        };
      });
      for (let i = 0; i < this.totalPages; i++) {
        this.seriesArr.push(temArr.slice(i * 5, (i + 1) * 5));
      }
      // 更新图表
      this.updateChart();
      // 设置动效
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      // 数据更新时的option
      let dataOption = {
        series: this.seriesArr[this.curIndex],
      };
      this.myChart.setOption(dataOption);
    },
    // 屏幕窗口变化调用
    screenAdapter() {
      // 利用盒子宽度来算出柱子宽度等
      let chartWidth = (this.$refs.srockChart.offsetWidth / 100) * 3.6;
      const temSeries = {
        type: "pie",
        radius: [chartWidth * 2.5, chartWidth * 3],
        label: {
          textStyle: {
            fontSize: chartWidth / 2,
          },
        },
      };
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: chartWidth,
          },
        },
        series: [temSeries, temSeries, temSeries, temSeries, temSeries],
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    // 设置动效
    startInterval() {
      this.timer = setInterval(() => {
        this.curIndex++;
        if (this.curIndex >= this.totalPages) this.curIndex = 0;
        this.updateChart();
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
</style>