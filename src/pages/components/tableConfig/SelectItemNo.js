/*
 * @Author: hjh
 * @Date: 2019-07-30 16:22:04
 * @LastEditTime: 2019-12-13 16:37:27
 * @Descripttion: 选择对象标识组件
 */

import React from 'react'
import { message } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import { connect } from 'dva'
import Modal from '../common/DragModal'

const columns = [
  {
    title: '对象标识',
    dataIndex: 'ITEMNO'
  },
  {
    title: '数据库表名',
    dataIndex: 'TABLENAME'
  },
  {
    title: '业务对象名称',
    dataIndex: 'NAME'
  }
]

const SelectItemNo = ({ dispatch, selectItemNo }) => {
  const { onSelect, selectedRowKeys, selectedRows, list, visible } = selectItemNo
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    dispatch({ type: 'selectItemNo/packet', payload: { selectedRowKeys, selectedRows } })
  }

  const toogleModal = () => {
    dispatch({ type: 'selectItemNo/packet', payload: { visible: false } })
  }

  const Ok = () => {
    if (selectedRows.length > 0) {
      onSelect(selectedRows)
      toogleModal()
    } else {
      message.warning('请选择字段~')
    }
  }

  const onSearch = queryWord => {
    dispatch({ type: 'selectItemNo/search', payload: { queryWord } })
  }
  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }
  const props = { list, columns, rowSelection, height: 400, onSearch }
  return (
    <Modal width={700} title='选择对象标识' visible={visible} onOk={Ok} onCancel={toogleModal}>
      <TableWithBtn {...props} />
    </Modal>
  )
}

function mapStateToProps({ selectItemNo }) {
  return { selectItemNo }
}

export default connect(mapStateToProps)(SelectItemNo)
