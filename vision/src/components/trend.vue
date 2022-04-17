<template>
  <div class="chart">
    <my-select
      class="myselect"
      :options="type"
      v-model="choiceType"
      :style="themeStyle"
    />
    <div class="chart" ref="sellerChart"></div>
  </div>
</template>

<script>
import mySelect from "./mySelect.vue";
import { mapState } from "vuex";
import {getThemeCss} from '../utils/theme_utils'
export default {
  components: { mySelect },
  data() {
    return {
      myChart: null,
      map: null, // 地图销量数据
      commodity: null, // 商品销售数据
      seller: null, // 商家销售数据
      xData: null, // x轴数据
      choiceType: "seller", // 当前选择图表，默认是map
      type: [], // 图表类型
      titleWidth: 66,
      themeStorage: "",
    };
  },
  created() {
    // 在websocket中，注册获取数据的回调函数
    this.$socket.registerCallBack("trendData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    // 改造，使用websocket获取数据
    this.$socket.send({
      action: "getData",
      chartName: "trend",
      value: "",
      socketType: "trendData",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("trendData");
  },
  methods: {
    // 初始化图表实例
    initChart() {
      this.myChart = this.$echarts.init(
        this.$refs.sellerChart,
        this.themeStorage
      );
      // 初始化时候的option
      let initOption = {
        title: {
          text: "▎",
          left: 20,
          top: 15,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        grid: {
          top: "35%",
          left: "3%",
          bottom: "3%",
          right: "3%",
          containLabel: true,
        },
        legend: {
          top: "15%",
          left: 20,
          icon: "circle",
        },
        tooltip: {
          trigger: "axis",
        },
      };
      this.myChart.setOption(initOption);
    },
    // 获取后台数据,并处理数据，更新图表
    getData(data) {
      // const { data } = await this.$http.get("/trend");
      // console.log(data);
      // 处理数据
      this.xData = data.common.month;
      this.map = this.dealData(data.map.data, "map");
      this.seller = this.dealData(data.seller.data, "seller");
      this.commodity = this.dealData(data.commodity.data, "commodity");
      this.type = data.type;
      // 更新图表
      this.updateChart();
    },
    // 更新图表
    updateChart() {
      // 数据更新时的option
      let dataOption = {
        xAxis: {
          data: this.xData,
        },
        series: this[this.choiceType].seriesArr,
        legend: {
          data: this[this.choiceType].legendArr,
        },
      };
      this.myChart.setOption(dataOption);
    },
    // 屏幕窗口变化调用
    screenAdapter() {
      // 利用盒子宽度来算出柱子宽度等
      this.titleWidth = (this.$refs.sellerChart.offsetWidth / 100) * 3.6;
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleWidth,
          },
          top: 18 + this.titleWidth / 4,
          left: 20 - this.titleWidth / 4,
        },
        legend: {
          itemWidth: this.titleWidth,
          itemHeight: this.titleWidth,
          itemGap: this.titleWidth,
          textStyle: {
            fontSize: this.titleWidth / 1.2,
          },
        },
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    // 处理后台数据函数
    dealData(data, stack) {
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      // 系列数据的配置
      let seriesArr = data.map((item, index) => {
        return {
          type: "line",
          name: item.name,
          data: item.data,
          stack,
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colorArr1[index] },
                { offset: 1, color: colorArr2[index] },
              ],
            },
          },
        };
      });
      // 图例数据
      let legendArr = data.map((item) => item.name);
      return { seriesArr, legendArr };
    },
  },
  watch: {
    choiceType() {
      this.updateChart();
    },
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
  computed: {
    ...mapState({
      // 主题切换
      theme: function (state) {
        // 使用缓存中的主题，避免刷新主题就消失了
        this.themeStorage = sessionStorage.getItem("theme") || "chalk";
        // console.log(this.themeStorage);
        return state.theme;
      },
    }),
    themeStyle(){
      let css = getThemeCss(this.themeStorage)
      return {
        color:css.color,
        backgroundColor:css.backgroundColor,
        fontSize: this.titleWidth + 'px' 
      }
    }
  },
};
</script>

<style lang="less" scoped>
.myselect {
  position: absolute;
  top: 15px;
  left: 40px;
  z-index: 10;
  color: #fff;
  // font-size: 66px;
  background-color: #222733;
  font-weight: 600;
}
</style>