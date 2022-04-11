// 设置响应头中间件
module.exports = async (ctx, next) => {
  let contentType = "application/json;charset=utf-8"
  ctx.set("Content-Type", contentType)
  ctx.response.body = '{"success":"true"}'
  ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE")
  await next()
}