// 服务器入口文件
const Koa = require("koa")
const app = new Koa()
// 绑定中间件
// 第一层中间件，耗时中间件
const durationResponse = require("./middleware/koa_response_duration")
app.use(durationResponse)
// 第二层中间件,响应头中间件
const headerResponse = require("./middleware/koa_response_header")
app.use(headerResponse)
// 第三层中间件,获取业务数据中间件
const dataResponse = require("./middleware/koa_response_data")
app.use(dataResponse)
// 绑定端口号
app.listen(8888, () => {
  console.log("8888端口正在监听~~")
})