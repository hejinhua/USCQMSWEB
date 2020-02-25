/*
 * @Author: hjh
 * @Date: 2019-07-30 16:22:04
 * @LastEditTime: 2019-10-24 16:49:42
 * @Descripttion: 选择文件对象的数据
 */

import React from 'react'
import { message } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import { connect } from 'dva'
import Modal from '../common/DragModal'

import { setColumn } from '../../../utils/columnUtil'

class SelectFileData extends React.Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    visible: true
  }

  componentWillReceiveProps() {
    this.setState({ selectedRowKeys: [], selectedRows: [] })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }

  Ok = () => {
    const { selectedRows } = this.state
    if (selectedRows.length > 0) {
      this.props.FileDataSelect(selectedRows)
    } else {
      message.warning('请选择字段~')
    }
  }

  render() {
    let {
      visible,
      selectFileData: { list, gridFieldList },
      toogleModal
    } = this.props
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'checkbox',
      onChange: this.onSelectChange,
      selectedRowKeys
    }
    const props = { list, columns: setColumn(gridFieldList), rowSelection, height: 400 }
    return (
      <Modal width={600} title='选择对象数据' visible={visible} onOk={this.Ok} onCancel={toogleModal}>
        <TableWithBtn {...props} />
      </Modal>
    )
  }
}

function mapStateToProps({ selectFileData }) {
  return { selectFileData }
}

export default connect(mapStateToProps)(SelectFileData)
