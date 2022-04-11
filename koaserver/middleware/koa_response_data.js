// 获取json数据中间件
const path = require("path")
const fileUtils = require("../utils/file_utils")
module.exports = async (ctx, next) => {
  // 整合需要获取文件的绝对路径
  let url = ctx.request.url
  let temPath = url.replace("/api", "../data") + ".json"
  let filePath = path.join(__dirname, temPath)
  // 获取数据
  try {
    let data = await fileUtils.getJsonData(filePath)
    ctx.response.body = data
  } catch (error) {
    const err = {
      errorMsg: "读取文件数据失败",
      status: 404
    }
    ctx.response.body = JSON.stringify(err)
  }
  await next()
}