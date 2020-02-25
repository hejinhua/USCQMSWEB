/*
 * @Author: hjh
 * @Date: 2019-07-30 16:22:04
 * @LastEditTime : 2019-12-25 14:27:25
 * @Descripttion: 选择字段组件
 */

import React from 'react'
import { connect } from 'dva'
import { message } from 'antd'
import Modal from '../common/DragModal'
import TableWithBtn from '../common/TableWithBtn'

const columns = [
  {
    title: '字段标识',
    dataIndex: 'NO'
  },
  {
    title: '字段名称',
    dataIndex: 'NAME'
  }
]
const SelectField = ({ selectField, dispatch }) => {
  const { visible, list, selectedRowKeys, selectedRows, onSelect } = selectField
  const toogleModal = () => {
    dispatch({ type: 'selectField/packet', payload: { visible: false } })
  }

  const Ok = () => {
    if (selectedRows.length > 0) {
      onSelect(selectedRows)
      toogleModal()
    } else {
      message.warning('请选择字段~')
    }
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    dispatch({ type: 'selectField/packet', payload: { selectedRowKeys, selectedRows } })
  }

  const rowSelection = {
    type: 'checkbox',
    onChange: onSelectChange,
    selectedRowKeys
  }
  const props = { list, columns, rowSelection, height: 400 }
  return (
    <Modal width={600} title='选择字段' visible={visible} onOk={Ok} onCancel={toogleModal}>
      <TableWithBtn {...props} />
    </Modal>
  )
}

function mapStateToProps({ selectField }) {
  return { selectField }
}

export default connect(mapStateToProps)(SelectField)
