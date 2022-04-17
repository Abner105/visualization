export default class SocketServer {
  static instance = null
  static get Instance() {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer()
    }
    return SocketServer.instance
  }
  ws = null
  connection = false
  connect() {
    if (!window.WebSocket) return
    this.ws = new WebSocket("ws://localhost:9998")
    this.ws.onopen = () => {
      console.log("连接socket成功")
      this.connection = true
    }
    this.ws.onclose = () => {
      console.log('连接关闭')
      this.connection = false
      setTimeout(() => {
        this.connect()
      }, 3000)
    }
    // 使用箭头函数不会改变callback的this，使callback的this指向vm
    this.ws.onmessage = (msg) => {
      // console.log(msg.data)
      let data = JSON.parse(msg.data)
      let socketType = data.socketType
      if (data.action == "getData") {
        let realData = JSON.parse(data.data)
        this.callBackMapping[socketType].call(this, realData)
      }else if(data.action == "fullScreen"){
        this.callBackMapping[socketType].call(this,data)
      }else if(data.action == 'themeChange'){
        this.callBackMapping[socketType].call(this)
      }
    }
    this.ws.onerror = function () {
      console.log('连接异常')
      this.connection = false
    }
  }
  callBackMapping = {}
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }
  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }
  send(data) {
    if (this.connection == true) {
      this.ws.send(JSON.stringify(data))
    } else {
      setTimeout(() => {
        this.ws.send(JSON.stringify(data))
      }, 500)
    }
  }

}