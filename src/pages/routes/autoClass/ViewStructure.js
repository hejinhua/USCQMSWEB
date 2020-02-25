/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime: 2019-12-11 11:35:38
 * @Descripttion: 视图结构树
 */

import React from 'react'
import { connect } from 'dva'
import { message } from 'antd'
import ViewStructureCmp from '../../components/autoClass/ViewStructureCmp'

import { showConfirm } from '../../../utils/utils'

const ViewStructure = ({ dispatch, viewStructure, PID, disabled }) => {
  const { selectedRows, selectedRowKeys, list = [] } = viewStructure

  const createNode = () => {
    if (selectedRows.length > 0) {
      const values = {
        NO: 'default',
        NAME: '节点',
        ITEMID: PID,
        PID: selectedRows[0].ID
      }
      dispatch({ type: 'viewStructure/addOrEdit', payload: { values, PID } })
    } else {
      message.warn('请选择节点')
    }
  }

  const del = () => {
    if (selectedRows[0]) {
      showConfirm(() => {
        dispatch({
          type: 'viewStructure/del',
          payload: { ID: selectedRows[0].ID, STATE: selectedRows[0].STATE, PID }
        })
      })
    } else {
      message.warning('请选择表对象!')
    }
  }

  const onOk = (values, record) => {
    dispatch({ type: 'viewStructure/addOrEdit', payload: { values, PID, record } })
  }

  const onTreeSelect = (selectedKeys, e) => {
    const { dataRef } = e.node.props
    const selectedNode = JSON.parse(JSON.stringify(dataRef))
    if (selectedNode.children) {
      delete selectedNode.children
    }
    dispatch({
      type: 'viewStructure/packet',
      payload: { selectedRowKeys: [selectedNode.ID], selectedRows: [selectedNode] }
    })
  }

  const props = { list, createNode, del, selectedRowKeys, onTreeSelect, selectedRows, onOk, disabled }

  return <ViewStructureCmp {...props} />
}

function mapStateToProps({ viewStructure }) {
  return { viewStructure }
}

export default connect(mapStateToProps)(ViewStructure)
