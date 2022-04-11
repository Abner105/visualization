<template>
  <div class="chart" ref="mapChart" @dblclick="backChina"></div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "../utils/map_utils";
export default {
  data() {
    return {
      myChart: null,
      seriesArr: [],
      legendArr: [],
      registedMap: [], //  所有注册过的地图省份
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
  },
  methods: {
    // 初始化图表实例
    async initChart() {
      this.myChart = this.$echarts.init(this.$refs.mapChart, "chalk");
      // 获取静态文件中的数据
      let { data } = await axios.get(
        "http://localhost:8999/static/map/china.json"
      );
      // 注册地图
      this.$echarts.registerMap("china", data);
      // 初始化时候的option
      let initOption = {
        title: {
          text: "▎商家分布",
          top: 20,
          left: 20,
        },
        geo: {
          type: "map",
          map: "china",
          itemStyle: {
            areaColor: "#2E73BF",
            borderColor: "#333",
          },
        },
        legend: {
          bottom: 20,
          left: 20,
          orient: "vertical",
        },
      };
      this.myChart.setOption(initOption);
      this.myChart.on("click", async (arg) => {
        let province = getProvinceMapInfo(arg.name);
        // 如果是undefined 不做任何操作
        if (province.key) {
          // 如果该地图已经注册过 就不需要再发请求了
          if (!this.registedMap.includes(province.key)) {
            let { data } = await axios.get(
              "http://localhost:8999" + province.path
            );
            this.$echarts.registerMap(province.key, data);
            this.registedMap.push(province.key);
          }
          let changeOption = {
            geo: {
              map: province.key,
            },
          };
          this.myChart.setOption(changeOption);
        }
      });
    },
    // 获取后台数据,并处理数据，更新图表
    async getData() {
      const { data } = await this.$http.get("/map");
      // 处理数据
      this.seriesArr = data.map((item) => {
        return {
          type: "effectScatter",
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
        };
      });
      this.legendArr = data.map((item) => item.name);
      // 更新图表
      this.updateChart();
    },
    // 更新图表
    updateChart() {
      // 数据更新时的option
      let dataOption = {
        series: this.seriesArr,
        legend: {
          data: this.legendArr,
        },
      };
      this.myChart.setOption(dataOption);
    },
    // 屏幕窗口变化调用
    screenAdapter() {
      // 利用盒子宽度来算出柱子宽度等
      let chartWidth = (this.$refs.mapChart.offsetWidth / 100) * 3.6;
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: chartWidth,
          },
        },
        legend: {
          itemWidth: chartWidth / 2,
          itemHeight: chartWidth / 2,
          itemGap: chartWidth / 2,
          textStyle: {
            fontSize: chartWidth / 2,
          },
        },
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    // 双击回到china图片
    backChina() {
      let changeOption = {
        geo: {
          map: "china",
        },
      };
      this.myChart.setOption(changeOption);
    },
  },
};
</script>

<style lang="less" scoped>
</style>