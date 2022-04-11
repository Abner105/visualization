const fs = require("fs")
// 读取文件数据
module.exports.getJsonData = (filePath) => {
  console.log(filePath)
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}