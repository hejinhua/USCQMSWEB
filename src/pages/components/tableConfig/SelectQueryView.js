/*
 * @Author: hjh
 * @Date: 2019-07-30 16:22:04
 * @LastEditTime: 2019-12-13 15:57:20
 * @Descripttion: 选择查询视图组件
 */

import React from 'react'
import { connect } from 'dva'
import Modal from '../common/DragModal'
import TableWithBtn from '../common/TableWithBtn'

const columns = [
  {
    title: '查询视图标识',
    dataIndex: 'NO'
  },
  {
    title: '查询视图名称',
    dataIndex: 'NAME'
  },
  {
    title: '查询对象',
    dataIndex: 'ITEMNO'
  },
  {
    title: '查询条件',
    dataIndex: 'WCONDITION'
  },
  {
    title: '控制权限',
    dataIndex: 'AONTROLAUTH',
    render(text) {
      return <span>{text ? '是' : '否'}</span>
    }
  },
  {
    title: '支持复制',
    dataIndex: 'COPYABLE',
    render(text) {
      return <span>{text ? '是' : '否'}</span>
    }
  }
]
const SelectQueryView = ({ selectQueryView, dispatch }) => {
  const { visible, selectedRowKeys, selectedRows, list, onSelect } = selectQueryView
  const toogleModal = () => {
    dispatch({ type: 'selectQueryView/packet', payload: { visible: false } })
  }

  const Ok = () => {
    onSelect(selectedRows[0])
    toogleModal()
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    dispatch({ type: 'selectQueryView/packet', payload: { selectedRowKeys, selectedRows } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }
  const onSearch = () => {}
  const props = { onSearch, list, columns, rowSelection, height: 400 }
  return (
    <Modal width={800} title='选择关联关系' visible={visible} onOk={Ok} onCancel={toogleModal}>
      <TableWithBtn {...props} />
    </Modal>
  )
}

function mapStateToProps({ selectQueryView, relationship }) {
  return { selectQueryView, relationship }
}

export default connect(mapStateToProps)(SelectQueryView)
