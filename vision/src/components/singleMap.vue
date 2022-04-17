<template>
  <div class="chart" ref="mapChart" @dblclick="backChina"></div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "../utils/map_utils";
import { mapState } from "vuex";
export default {
  data() {
    return {
      myChart: null,
      seriesArr: [],
      legendArr: [],
      registedMap: [], //  所有注册过的地图省份
      themeStorage:''
    };
  },
  created() {
    this.$socket.registerCallBack("mapData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    // 改造，使用websocket获取数据
    this.$socket.send({
      action: "getData",
      chartName: "map",
      value: "",
      socketType: "mapData",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("mapData");
  },
  methods: {
    // 初始化图表实例
    async initChart() {
      this.myChart = this.$echarts.init(this.$refs.mapChart, this.themeStorage);
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
    async getData(data) {
      // const { data } = await this.$http.get("/map");
      // 处理数据
      this.seriesArr = data.map((item) => {
        return {
          type: "effectScatter",
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
          rippleEffect: {
            scale: 7,
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
            fontSize: chartWidth / 1.2,
          },
        },
        legend: {
          itemWidth: chartWidth / 1.5,
          itemHeight: chartWidth / 1.5,
          itemGap: chartWidth / 1.5,
          textStyle: {
            fontSize: chartWidth / 1.5,
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