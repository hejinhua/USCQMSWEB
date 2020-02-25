/*
 * 修改密码表单
 * @Author: hjh
 * @Date: 2019-05-13 14:50:43
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-03 11:09:44
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import ScrollTable from '../common/scrollTable/ScrollTable'
import { Icon, Badge } from 'antd'
// import * as commonService from '../../service/commonService'
import Modal from '../common/DragModal'
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import PropertyForm from '../engine/property/PropertyForm'
import { dateToFormat } from '../../../utils/dataToFormat'

const columns = [
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 80
  },
  {
    title: '登录IP',
    dataIndex: 'ip',
    width: 100
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    width: 150,
    render(text) {
      return <div>{dateToFormat(text)}</div>
    }
  },
  {
    title: '员工工号',
    dataIndex: 'employeeNo',
    width: 80
  },
  {
    title: '员工名称',
    dataIndex: 'employeeName',
    width: 100
  },
  {
    title: '电话',
    dataIndex: 'tel',
    width: 100
  },
  {
    title: '邮箱',
    dataIndex: 'mail',
    width: 100
  },
  {
    title: '部门代号',
    dataIndex: 'departMentNo',
    width: 80
  },
  {
    title: '所属部门',
    dataIndex: 'departMentName',
    width: 100
  },
  {
    title: '终端类型',
    dataIndex: 'osBowser',
    width: 150,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  }
]
const pageFieldList = []
columns.forEach(item => {
  pageFieldList.push({ no: item.dataIndex, name: item.title, editor: 'TextBox' })
})
class OnlineUser extends Component {
  state = {
    list: [],
    visible: false,
    visible2: false,
    record: {}
  }

  componentDidMount() {
    // commonService.common({ implclass: 'com.usc.app.us.user.GetOnlieUserInfoAction', itemNo: 'SYSLOG' }).then(res => {
    //   if (res && res.data && res.data.dataList) {
    //     this.setState({ list: res.data.dataList })
    //   }
    // })
    // this.timer = setInterval(() => {
    //   if (sessionStorage.getItem('isAuthenticated') === 'true') {
    //     commonService
    //       .common({ implclass: 'com.usc.app.us.user.GetOnlieUserInfoAction', itemNo: 'SYSLOG' })
    //       .then(res => {
    //         if (res && res.data && res.data.dataList) {
    //           this.setState({ list: res.data.dataList })
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
          <Icon type='team' style={{ color: 'red', fontSize: '24px' }} onClick={this.toogleModal} />
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
export default connect(mapStateToProps)(OnlineUser)
