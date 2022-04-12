import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
const SellerPage = ()=>import("../views/SellerPage")
const TrendPage = ()=>import("../views/TrendPage")
const MapPage = ()=>import("../views/MapPage")
const RankPage = ()=>import("../views/RankPage")
const HotPage = ()=>import("../views/HotPage")
const StockPage = ()=>import('../views/StockPage')
// import SellerPage from '../views/SellerPage'
// import TrendPage from "../views/TrendPage"
// import MapPage from "../views/MapPage"
// import RankPage from "../views/RankPage"
// import HotPage from "../views/HotPage"




Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    component: TrendPage
  },
  {
    path:"/mappage",
    component:MapPage
  },
  {
    path:"/rankpage",
    component:RankPage
  },
  {
    path:"/hotpage",
    component:HotPage
  },
  {
    path:"/stockpage",
    component:StockPage
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
