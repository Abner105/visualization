// 总耗时中间件
module.exports = async (ctx, next) => {
  let start = Date.now()
  await next()
  let end = Date.now()
  let duration = end - start
  // 设置总耗时的响应头
  ctx.set("X-Response-Time", duration + "ms")
}