import React, { Component } from 'react'
import { connect } from 'dva'
import ScrollTable from '../common/scrollTable/ScrollTable'
import { Icon, Badge } from 'antd'
import Modal from '../common/DragModal'
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import PropertyForm from '../engine/property/PropertyForm'
// import * as commonService from '../../service/commonService'

const columns = [
  {
    title: '预警编号',
    dataIndex: 'NO',
    width: 80
  },
  {
    title: '内容描述',
    dataIndex: 'NAME',
    width: 100,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '预警类型',
    dataIndex: 'TYPE',
    width: 150
  },
  {
    title: '状态',
    dataIndex: 'STATE',
    width: 80
  },
  {
    title: '严重程度',
    dataIndex: 'SEVERITY',
    width: 100
  },
  {
    title: '影响',
    dataIndex: 'INFLUENCES',
    width: 100,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '预计持续时长',
    dataIndex: 'CONTINUEDTIME',
    width: 100
  },
  {
    title: '应对措施',
    dataIndex: 'MEASURES',
    width: 80,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '处理状态',
    dataIndex: 'DWSTATE',
    width: 100
  }
]
const pageFieldList = []
columns.forEach(item => {
  pageFieldList.push({ no: item.dataIndex, name: item.title, editor: 'TextBox' })
})

class Alert extends Component {
  state = {
    list: [],
    visible: false,
    visible2: false,
    record: {}
  }

  componentDidMount() {
    // commonService
    //   .common({
    //     implclass: 'com.usc.app.action.demo.zc.GetAlertByUser',
    //     itemNo: 'EARLYWARNING',
    //     condition: `DWUSER = '${localStorage.getItem('userName')}'`
    //   })
    //   .then(res => {
    //     if (res && res.data && res.data.dataList) {
    //       this.setState({ list: res.data.dataList[0] })
    //     }
    //   })
    // this.timer = setInterval(() => {
    //   if (sessionStorage.getItem('isAuthenticated') === 'true') {
    //     commonService
    //       .common({ implclass: 'com.usc.app.action.demo.zc.GetAlertByUser', itemNo: 'EARLYWARNING',condition: `DWUSER = '${localStorage.getItem('userName')}'` })
    //       .then(res => {
    //         if (res && res.data && res.data.dataList) {
    //           this.setState({ list: res.data.dataList[0] })
    //         }
    //       })
    //   }
    // }, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  Ok = () => {
    this.props.toogleModal()
  }

  toogleModal = () => {
    this.setState({ visible: !this.state.visible })
  }

  toogleModal2 = () => {
    this.setState({ visible2: !this.state.visible2 })
  }

  onDoubleClick = record => {
    this.toogleModal2()
    this.setState({ record })
  }

  render() {
    const { list = [], visible, visible2, record } = this.state
    return (
      <div style={{ color: '#000', marginTop: 3, marginRight: 5, display: 'inline-block' }}>
        <Badge count={list.length}>
          <Icon type='alert' style={{ fontSize: '24px' }} onClick={this.toogleModal} />
        </Badge>
        <Modal visible={visible} title='在线人员明细' onCancel={this.toogleModal} width='80%' onOk={this.toogleModal}>
          <ScrollTable height={200} list={list} columns={columns} onDoubleClick={this.onDoubleClick} />
        </Modal>
        <Modal title='详细信息' width={700} visible={visible2} onOk={this.toogleModal2} onCancel={this.toogleModal2}>
          <PropertyForm columns={1} pageFieldList={pageFieldList} showBtn={false} record={record} {...this.props} />
        </Modal>
      </div>
    )
  }
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(Alert)
