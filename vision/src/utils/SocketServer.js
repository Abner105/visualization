export default class SocketServer{
  static instance = null
  static get Instance(){
    if(!SocketServer.instance){
      SocketServer.instance = new SocketServer()
    }
    return SocketServer.instance
  }
  ws = null
  connect(){
    if (!window.WebSocket) return
    this.ws = new WebSocket("ws://localhost:9998")
    this.ws.onopen = function(){
      console.log("连接socket成功")
    }
    this.ws.onclose=function(){
      console.log('连接关闭')
    }
    // 使用箭头函数不会改变callback的this，使callback的this指向vm
    this.ws.onmessage = (msg)=>{
      // console.log(msg.data)
      let data = JSON.parse(msg.data)
      let socketType = data.socketType
      let realData = JSON.parse(data.data)
      this.callBackMapping[socketType].call(this,realData)
    }
    this.ws.onerror =function(){
      console.log('连接异常')
    }
  }
  callBackMapping = {}
  registerCallBack(socketType,callBack){
    this.callBackMapping[socketType] = callBack
  }
  unRegisterCallBack(socketType){
    this.callBackMapping[socketType] = null
  }
  send(data){
    this.ws.send(JSON.stringify(data))
  }
}