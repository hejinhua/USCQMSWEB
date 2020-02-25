/*
 * @Author: hjh
 * @Date: 2019-09-04 16:16:53
 * @LastEditTime: 2019-12-12 10:35:49
 * @Descripttion: 系统日志
 */

import React from 'react'
import { connect } from 'dva'
import SystemLogCmp from '../../components/sys/SystemLogCmp'

import Ellipsis from 'ant-design-pro/lib/Ellipsis'

const columns = [
  {
    title: '对象表名',
    dataIndex: 'OBJTN',
    width: 100
  },
  {
    title: '对象名称',
    dataIndex: 'OBJNAME',
    width: 100
  },
  {
    title: '对象ID',
    dataIndex: 'OBJID',
    width: 120,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '操作',
    dataIndex: 'ACTION',
    width: 100
  },
  {
    title: '操作明细',
    dataIndex: 'DETAILS',
    width: 250,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: 'IP',
    dataIndex: 'IP',
    width: 100
  },
  {
    title: '操作时间',
    dataIndex: 'CTIME',
    width: 130
  },
  {
    title: '操作人',
    dataIndex: 'CUSER',
    width: 80
  }
]

const pageFieldList = []
columns.forEach(item => {
  if (item.dataIndex === 'DETAILS') {
    pageFieldList.push({
      no: item.dataIndex,
      name: item.title,
      editor: 'TextArea',
      editParams: JSON.stringify({ rowHeight: 8 })
    })
  } else {
    pageFieldList.push({ no: item.dataIndex, name: item.title, editor: 'TextBox' })
  }
})
const SystemLog = ({ dispatch, systemLog }) => {
  let { dataList, record, selectedRowKey, visible } = systemLog

  const toogleModal = (record = {}) => {
    dispatch({ type: 'systemLog/toogleModal', payload: { record } })
  }

  const onSelect = (selectedKeys, e) => {
    const { dataRef } = e.node.props
    dispatch({
      type: `systemLog/packet`,
      payload: { selectedRowKey: [dataRef.key], selectedRows: [dataRef] }
    })
    if (dataRef.action) {
      dispatch({
        type: `systemLog/queryWithAction`,
        payload: { action: dataRef.action }
      })
    }
  }
  const onDoubleClick = record => {
    toogleModal(record)
  }

  const props = {
    dataList,
    columns,
    record,
    toogleModal,
    visible,
    onSelect,
    onDoubleClick,
    selectedRowKey,
    pageFieldList
  }

  return <SystemLogCmp {...props} />
}

function mapStateToProps({ systemLog }) {
  return { systemLog }
}

export default connect(mapStateToProps)(SystemLog)
