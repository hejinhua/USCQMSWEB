/*
 * @Author: hjh
 * @Date: 2019-07-30 16:22:04
 * @LastEditTime: 2019-12-13 16:50:07
 * @Descripttion: 选择关联关系组件
 */

import React from 'react'
import { connect } from 'dva'
import Modal from '../common/DragModal'
import TableWithBtn from '../common/TableWithBtn'
import RelationshipForm from '../relationship/RelationshipForm'

const columns = [
  {
    title: '标识',
    dataIndex: 'NO'
  },
  {
    title: '关系名称',
    dataIndex: 'NAME'
  },
  {
    title: '关系对象',
    dataIndex: 'RELATIONITEM'
  },
  {
    title: '对象A',
    dataIndex: 'ITEMA'
  },
  {
    title: '对象B',
    dataIndex: 'ITEMB'
  },
  {
    title: '关系集合中的父对象',
    dataIndex: 'PITEM'
  }
]
const SelectRelation = ({ selectRelation, dispatch, relationship }) => {
  const { visible, selectedRowKey, selectedRows, list = [], onSelect } = selectRelation
  const { record = {}, visible: relationVisible } = relationship
  const toogleModal = () => {
    dispatch({ type: 'selectRelation/packet', payload: { visible: false } })
  }

  const toogleEdit = () => {
    dispatch({ type: 'relationship/packet', payload: { visible: true, record: {} } })
  }

  const onCancel = () => {
    dispatch({ type: 'relationship/packet', payload: { visible: false } })
  }

  const Ok = () => {
    onSelect(selectedRows[0])
    toogleModal()
  }

  const onSelectChange = (selectedRowKey, selectedRows) => {
    dispatch({ type: 'selectRelation/packet', payload: { selectedRowKey, selectedRows } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }
  const onSearch = () => {}
  const btns = [
    {
      name: '新建',
      func: () => {
        toogleEdit()
      }
    }
  ]
  const props = { onSearch, list, columns, btns, rowSelection, height: 400 }
  const formProps = { record, visible: relationVisible, title: '关联关系', toogleModal: onCancel }
  return (
    <Modal width={800} title='选择关联关系' visible={visible} onOk={Ok} onCancel={toogleModal}>
      <TableWithBtn {...props} />
      <RelationshipForm {...formProps} />
    </Modal>
  )
}

function mapStateToProps({ selectRelation, relationship }) {
  return { selectRelation, relationship }
}

export default connect(mapStateToProps)(SelectRelation)
