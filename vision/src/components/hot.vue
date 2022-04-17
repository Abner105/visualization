<template>
  <div class="chart">
    <div class="chart" ref="hotChart"></div>
    <span
      class="left"
      @click="exchange('left')"
      :style="themeStyle"
      >〈</span
    >
    <span
      class="right"
      @click="exchange('right')"
      :style="themeStyle"
      >〉</span
    >
    <div class="subtitle" :style="themeStyle">
      {{ subTitle[curIndex] }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {getThemeCss} from '../utils/theme_utils'
export default {
  data() {
    return {
      myChart: null,
      allData: [],
      curIndex: 0,
      legendData: [],
      subTitle: [],
      chartWidth: 0,
      themeStorage: "chalk",
    };
  },
  created() {
    this.$socket.registerCallBack("hotData", this.getData);
  },
  mounted() {
    this.initChart();
    // this.getData();
    // 改造，使用websocket获取数据
    this.$socket.send({
      action: "getData",
      chartName: "hotproduct",
      value: "",
      socketType: "hotData",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("hotData");
  },
  methods: {
    // 初始化图表实例
    initChart() {
      this.myChart = this.$echarts.init(this.$refs.hotChart, this.themeStorage);
      // 初始化时候的option
      let initOption = {
        title: {
          text: "▎热销商品销售金融占比",
          top: 20,
          left: 20,
        },
        legend: {
          top: "15%",
          icon: "circle",
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            let data = arg.data.children;
            let res = "";
            let totalValue = data.reduce((pre, ch) => pre + ch.value, 0);
            data.forEach((ch) => {
              res += `
              ${ch.name} : ${((ch.value / totalValue) * 100).toFixed(2)}%
              <br>
              `;
            });
            return res;
          },
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["50%", "53%"],
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
                formatter: "{b} : {d}%",
              },
            },
            labelLine: {
              show: false,
            },
          },
        ],
      };
      this.myChart.setOption(initOption);
    },
    // 获取后台数据,并处理数据，更新图表
    async getData(data) {
      // const { data } = await this.$http.get("/hotproduct");
      // console.log(data);
      // 处理数据
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let legenOne = item.children.map((ch) => ch.name);
        this.allData.push(item.children);
        this.legendData.push(legenOne);
        this.subTitle.push(item.name);
      }
      // 更新图表
      this.updateChart();
    },
    // 更新图表
    updateChart() {
      // 数据更新时的option
      let dataOption = {
        series: [
          {
            data: this.allData[this.curIndex],
          },
        ],
        legend: {
          data: this.legendData[this.curIndex],
        },
      };
      this.myChart.setOption(dataOption);
    },
    // 屏幕窗口变化调用
    screenAdapter() {
      // 利用盒子宽度来算出柱子宽度等
      this.chartWidth = (this.$refs.hotChart.offsetWidth / 100) * 3.6;
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: this.chartWidth,
          },
        },
        legend: {
          itemWidth: this.chartWidth,
          itemHeight: this.chartWidth,
          itemGap: this.chartWidth,
          textStyle: {
            fontSize: this.chartWidth / 1.2,
          },
        },
        series: [
          {
            label: {
              fontSize: this.chartWidth / 2,
            },
          },
        ],
      };
      this.myChart.setOption(adapterOption);
      this.myChart.resize();
    },
    // 左右切换
    exchange(type) {
      switch (type) {
        case "left":
          this.curIndex--;
          if (this.curIndex < 0) this.curIndex = this.allData.length - 1;
          break;
        case "right":
          this.curIndex++;
          if (this.curIndex > this.allData.length - 1) this.curIndex = 0;
          break;
      }
      this.updateChart();
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
    themeStyle(){
      let css = getThemeCss(this.themeStorage)
      return {
        color:css.color,
        fontSize: this.titleWidth + 'px' 
      }
    }
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
span {
  color: #fff;
  position: absolute;
  z-index: 12;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.left {
  left: 8%;
}
.right {
  right: 8%;
}
.subtitle {
  color: #fff;
  position: absolute;
  z-index: 10;
  bottom: 10%;
  right: 20%;
}
</style>