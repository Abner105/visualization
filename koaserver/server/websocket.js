const path = require("path")
const fileUtils = require("../utils/file_utils")

const websocket = require('ws')
const wss = new websocket.Server({
  port:9998
})
// 数据格式：
// {
//   action:"getData", // fullScreen,themeChange
//   socketType:"",
//   chartName:'',
//   value:'',
// }
module.exports.listen = ()=>{
  wss.on('connection',client=>{
    console.log('连接成功')
    client.on('message',async msg=>{
      let payload = JSON.parse(msg)
      if (payload.action == "getData"){
        let temPath = '../data/'+payload.chartName + ".json"
        let filePath = path.join(__dirname, temPath)
        try {
          payload.data = await fileUtils.getJsonData(filePath)
        } catch (error) {
          payload.err = {
            errorMsg: "读取文件数据失败",
            status: 404
          }
        }
        client.send(JSON.stringify(payload))
      }else{
        wss.clients.forEach(client=>{
          client.send(JSON.stringify(payload))
        })
      }
      // console.log("接收前端的数据"+msg)
      // client.send('回复前端数据')
    })
    // client.send('服务端数据')
  })
}