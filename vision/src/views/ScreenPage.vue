<template>
  <div class="screen-container" :style="themeStyle">
    <header class="screen-header">
      <div>
        <img alt="" :src="headBorder" />
      </div>
      <span class="logo">
        <img alt="" :src="logo" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img class="qiehuan" @click="clickTheme" :src="qiehuan" />
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="{ fullscreen: fullscreen.trend }">
          <!-- 销量趋势图表 -->
          <trend ref="trend" />
          <div class="resize">
            <span
              @click="changeFull('trend')"
              :class="[
                'iconfont',
                fullscreen.trend ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div id="left-bottom" :class="{ fullscreen: fullscreen.seller }">
          <!-- 商家销售金额图表 -->
          <seller ref="seller" />
          <div class="resize">
            <span
              @click="changeFull('seller')"
              :class="[
                'iconfont',
                fullscreen.seller ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="{ fullscreen: fullscreen.map }">
          <!-- 商家分布图表 -->
          <Map ref="map" />
          <div class="resize">
            <span
              @click="changeFull('map')"
              :class="[
                'iconfont',
                fullscreen.map ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div id="middle-bottom" :class="{ fullscreen: fullscreen.rank }">
          <!-- 地区销量排行图表 -->
          <rank ref="rank" />
          <div class="resize">
            <span
              @click="changeFull('rank')"
              :class="[
                'iconfont',
                fullscreen.rank ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="{ fullscreen: fullscreen.hot }">
          <!-- 热销商品占比图表 -->
          <hot ref="hot" />
          <div class="resize">
            <span
              @click="changeFull('hot')"
              :class="[
                'iconfont',
                fullscreen.hot ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div id="right-bottom" :class="{ fullscreen: fullscreen.stock }">
          <!-- 库存销量分析图表 -->
          <stock ref="stock" />
          <div class="resize">
            <span
              @click="changeFull('stock')"
              :class="[
                'iconfont',
                fullscreen.stock ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from "@/components/hot.vue";
import Map from "@/components/singleMap.vue";
import Rank from "@/components/rank.vue";
import Seller from "@/components/seller.vue";
import Stock from "@/components/stock.vue";
import Trend from "@/components/trend.vue";
import { getThemeCss } from "../utils/theme_utils";
import { mapState } from "vuex";
export default {
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend,
  },
  data() {
    return {
      fullscreen: {
        hot: false,
        map: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false,
      },
      themeStorage: "",
    };
  },
  created() {
    this.$socket.registerCallBack("fullScreen", this.recvFn);
    this.$socket.registerCallBack("themeChange", this.changeCallBack);
  },
  distoryed() {
    this.$socket.unRegisterCallBack("fullScreen");
    this.$socket.unRegisterCallBack("themeChange");
  },
  methods: {
    changeFull(chartName) {
      console.log(chartName);
      // 发送给服务器，再由服务器转发给其他客户端
      this.$socket.send({
        action: "fullScreen",
        chartName: chartName,
        value: !this.fullscreen[chartName],
        socketType: "fullScreen",
      });
    },
    // 全屏操作的回调函数
    recvFn(data) {
      console.log(data);
      this.fullscreen[data.chartName] = data.value;
      this.$nextTick(() => {
        this.$refs[data.chartName].screenAdapter();
      });
    },
    // 切换主题
    clickTheme() {
      this.$socket.send({
        action: "themeChange",
        chartName: '',
        value: '',
        socketType: "themeChange",
      });
    },
    changeCallBack() {
      this.$store.commit("changeTheme");
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
    themeStyle() {
      let css = getThemeCss(this.themeStorage);
      return {
        color: css.color,
        backgroundColor: css.headBackground,
      };
    },
    headBorder() {
      return "/static/img/" + getThemeCss(this.themeStorage).headBorder;
    },
    logo() {
      return "/static/img/" + getThemeCss(this.themeStorage).logo;
    },
    qiehuan() {
      return "/static/img/" + getThemeCss(this.themeStorage).qiehuan;
    },
  },
  watch: {
    // 主题切换
    theme() {
      this.themeStorage = sessionStorage.getItem("theme") || "charlk";
    },
  },
};
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      margin-top: 2px;
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
