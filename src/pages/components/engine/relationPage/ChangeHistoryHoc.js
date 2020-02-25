import { Component } from 'react'
import ScrollTable from '../../common/scrollTable/ScrollTable'
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import PropertyForm from '../property/PropertyForm'
import Modal from '../../common/DragModal'

import styles from '../engine.css'
/**
 * @desc 表格高阶组件
 * @param engine
 * @returns {function(*)}
 * @constructor
 */

const columns = [
  {
    title: '操作',
    dataIndex: 'ACTION',
    width: 100
  },
  {
    title: '操作人',
    dataIndex: 'cuser',
    width: 100
  },
  {
    title: '操作时间',
    dataIndex: 'ctime',
    width: 150
  },
  {
    title: '变更明细',
    dataIndex: 'DETAILS',
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
const ChangeHistoryHoc = engine => WrappedComponent => {
  return class extends Component {
    toogleModal = (record = {}) => {
      this.props.dispatch({
        type: `${engine.namespace}/packet`,
        payload: {
          historyVisible: !this.props.model.historyVisible,
          record
        }
      })
    }
    onDoubleClick = record => {
      this.toogleModal(record)
    }
    render() {
      return (
        <div className={styles.flexY}>
          <WrappedComponent {...this.props} />
          <div className={styles.flexGrowY}>
            <ScrollTable model={this.props.model} columns={columns} onDoubleClick={this.onDoubleClick} />
          </div>
          <Modal
            title='变更历史明细'
            width={700}
            visible={this.props.model.historyVisible}
            onOk={this.toogleModal}
            onCancel={this.toogleModal}
          >
            <PropertyForm
              columns={1}
              pageFieldList={pageFieldList}
              showBtn={false}
              record={this.props.model.record}
              {...this.props}
            />
          </Modal>
        </div>
      )
    }
  }
}

export default ChangeHistoryHoc
