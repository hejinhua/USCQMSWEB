import Socket from './websocketConfig'
import React from 'react'
import * as commonService from '../pages/service/commonService'

class websocket extends React.Component {
  constructor() {
    super()
    // this.taskRemindInterval = null
  }
  componentDidMount = () => {}
  render() {
    const initFormData = {}
    const values = {
      implclass: 'com.usc.app.ims.config.action.ChatInitUsers',
      itemNo: 'SUSER',
      userName: localStorage.getItem('userName')
    }
    initFormData.values = JSON.stringify(values)
    /* global layui */
    layui.use('layim', function(layim) {
      //    判断专家是否登录
      this.socket = new Socket({
        socketUrl: `ws://192.168.2.54:8899/ws/${localStorage.getItem('userId')}`,
        socketOpen: () => {
          console.log('websocket连接建立成功')
          //初始化完成后获取离线信息
          layim.on('ready', function() {
            socket.sendMessage('lx' + localStorage.getItem('userId'))
          })
          // 心跳机制 定时向后端发数据
          // this.taskRemindInterval = setInterval(() => {
          //   this.socket.sendMessage({ msgType: 0 })
          // }, 30000)
        },
        socketError: () => {
          console.log('websocket出错了')
        },
        //后端返回的数据，渲染页面
        socketMessage: event => {
          console.log(event.data)
        },
        socketClose: () => {
          console.log('websocket关闭')
        }
      })
      let socket = this.socket
      layim.config({
        init: {
          url: `api/dcm/access`,
          type: 'post',
          data: initFormData
        },
        //查看群员接口
        members: {
          url: `/api/dcm/access`,
          type: 'post',
          data: ''
        },
        //默认最小化
        min: true,
        //缩小后的标题
        title: '聊天室',
        //消息提醒
        notice: true,

        //简约模式（不显示主面板
        //,brief: true

        // ,msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可
        find: layui.cache.dir + 'css/modules/layim/html/group.html', //发现页面地址，若不开启，剔除该项即可
        chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html' //聊天记录页面地址，若不开启，剔除该项即可
      })
      //当主面板的签名被改动后触发，并返回新的签名
      layim.on('sign', function(value) {
        const params = {
          itemNo: 'SUSER',
          implclass: 'com.usc.app.ims.config.action.EditChatSign',
          condition: value
        }
        commonService.common(params)
      })
      //监听发送消息
      layim.on('sendMessage', function(data) {
        let mine = data.mine //包含我发送的消息及我的信息
        let To = data.to //对方的信息
        //发送消息到WebSocket服务
        send(mine, To)
      })
      //发送消息的方法
      function send(mine, To) {
        const index = To.name.indexOf('<')
        const toName = To.name.substring(0, index)
        socket.sendMessage(
          mine.avatar +
            '_msg_' +
            mine.id +
            '_msg_' +
            mine.username +
            '_msg_' +
            To.id +
            '_msg_' +
            toName +
            '_msg_' +
            mine.content +
            '_msg_' +
            To.type +
            '_msg_NAN'
        )
      }
      //重试创建websocket连接
      try {
        this.socket.connection()
      } catch (e) {
        // 捕获异常，防止js error
        // donothing
      }
    })
    return null
  }
}

export default websocket
