/**
 * 参数：[socketOpen|socketClose|socketMessage|socketError] = func，[socket连接成功时触发|连接关闭|发送消息|连接错误]
 * timeout：连接超时时间
 * @type {module.webSocket}
 */
class webSocket {
  constructor(param = {}) {
    this.param = param
    this.socket = null
    this.taskRemindInterval = null
    this.isSucces = true
  }

  connection = () => {
    let { socketUrl, timeout = 0 } = this.param
    // 检测当前浏览器是什么浏览器来决定用什么socket
    if ('WebSocket' in window || 'MozWebSocket' in window) {
      this.socket = new WebSocket(socketUrl)
    }
    // if ('WebSocket' in window) {
    //   console.log('WebSocket')
    //
    //   this.socket = new WebSocket(socketUrl)
    // } else if ('MozWebSocket' in window) {
    //   console.log('MozWebSocket')
    //
    //   this.socket = new MozWebSocket(socketUrl)
    // } else {
    //   console.log('SockJS')
    //
    //   this.socket = new SockJS(socketUrl)
    // }
    this.socket.onopen = this.onopen
    this.socket.onmessage = this.onmessage
    this.socket.onclose = this.onclose
    this.socket.onerror = this.onerror
    // 检测返回的状态码 如果socket.readyState不等于1则连接失败，关闭连接
    if (timeout) {
      let time = setTimeout(() => {
        if (this.socket && this.socket.readyState !== 1) {
          this.socket.close()
        }
        clearInterval(time)
      }, timeout)
    }
  }
  // 连接成功触发
  onopen = () => {
    let { socketOpen } = this.param
    this.isSucces = false //连接成功将标识符改为false
    socketOpen && socketOpen()
  }
  // 后端向前端推得数据
  onmessage = event => {
    let { socketMessage } = this.param
    socketMessage && socketMessage(event)
    // console.log('后端推送的消息：' + event.data)
    if (event.data === '@NT_RUR' || event.data === '@NT_RR' || event.data === '@NT_EXCEPTION') {
      window.g_app._store.dispatch({ type: 'notice/query' })
    }
    /* global layui */
    layui.use(['layim', 'layer'], function() {
      let layim = layui.layim
      // let layer = layui.layer
      if (event.data.indexOf('_msg_') >= 0) {
        let arra = event.data.split('_msg_')
        let sender = arra[0] //发送者loginname
        let avatar = arra[1] //发送者头像
        let senderId = arra[2] //私聊是发送者id，群聊是群id
        let type = arra[3] //类型
        let content = arra[4] //信息
        let sendtime = arra[5] //时间
        if ('group' === type) {
          if (sendtime !== 'NAN') {
            layim.getMessage({
              username: sender,
              avatar: `api/src/user/getAvatar/${localStorage.getItem('userId')}`,
              id: senderId,
              type: type,
              content: content,
              timestamp: parseFloat(sendtime)
            })
          } else {
            layim.getMessage({
              username: sender,
              avatar: avatar,
              id: senderId,
              type: type,
              content: content
            })
          }
        } else if ('setOnline' === type) {
          // layer.msg(sender + '上线了')
          console.log(sender + '上线了')
          //设置上线用户头像取消置灰
          layim.setFriendStatus(senderId, 'online')
        } else if ('setOffline' === type) {
          // layer.msg(sender + '下线了')
          //设置上线用户头像取消置灰
          layim.setFriendStatus(senderId, 'offline')
        } else {
          if (sendtime !== 'NAN') {
            //使用历史记录时间
            layim.getMessage({
              username: sender,
              avatar: avatar,
              id: senderId,
              type: type,
              content: content,
              timestamp: parseFloat(sendtime)
            })
          } else {
            layim.getMessage({
              username: sender,
              avatar: `api/src/user/getAvatar/` + sender,
              id: senderId,
              type: type,
              content: content
            })
          }
        }
      }
    })
  }
  // 关闭连接触发
  onclose = () => {
    let { socketClose } = this.param
    this.isSucces = true //关闭将标识符改为true
    console.log('关闭socket收到的数据')
    socketClose && socketClose()
  }
  onerror = () => {
    // socket连接报错触发
    let { socketError } = this.param
    this.socket = null
    socketError && socketError()
  }
  sendMessage = value => {
    console.log('=====', value)
    // 向后端发送数据
    if (this.socket) {
      this.socket.send(value)
    }
  }
}

export default webSocket
