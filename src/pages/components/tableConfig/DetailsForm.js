import React from 'react'
import PropertyForm from '../engine/property/PropertyForm'
import Modal from '../common/DragModal'
import { connect } from 'dva'

const DetailsForm = ({ details, dispatch }) => {
  let { pageFieldList = [], visible, record, title, width, columns, columnsNum } = details
  const toogleModal = () => {
    dispatch({ type: 'details/packet', payload: { visible: false } })
  }
  if (columns) {
    columns.forEach(item => {
      if (item.WIDTH >= 200) {
        pageFieldList.push({
          no: item.dataIndex,
          name: item.title,
          editor: 'TextArea',
          editParams: JSON.stringify({ rowHeight: 2 })
        })
      } else {
        pageFieldList.push({ no: item.dataIndex, name: item.title, editor: 'TextBox' })
      }
    })
  }

  return (
    <Modal title={title || '详细信息'} width={width || 800} visible={visible} onOk={toogleModal} onCancel={toogleModal}>
      <PropertyForm columns={columnsNum || 1} pageFieldList={pageFieldList} showBtn={false} record={record} />
    </Modal>
  )
}

function mapStateToProps({ details }) {
  return { details }
}

export default connect(mapStateToProps)(DetailsForm)
