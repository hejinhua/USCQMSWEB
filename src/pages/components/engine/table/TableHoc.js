import { Component } from 'react'
import ScrollTable from '../../common/scrollTable/ScrollTable'

import styles from '../engine.css'
/**
 * @desc 表格高阶组件
 * @param engine
 * @returns {function(*)}
 * @constructor
 */
const TableHoc = engine => WrappedComponent => {
  const onChange = (selectedRowKeys, selectedRows) => {
    window.g_app._store.dispatch({
      type: `${engine.namespace}/packet`,
      payload: { selectedRowKeys, selectedRows }
    })
  }

  return class extends Component {
    render() {
      const rowSelection = {
        type: engine.itemGrid.rowSelectionType || 'checkbox',
        onChange,
        selectedRowKeys: this.props.model.selectedRowKeys
      }
      return (
        <div className={styles.flexY}>
          <WrappedComponent {...this.props} />
          <div className={engine.isModal ? '' : styles.flexGrowY}>
            <ScrollTable
              rowSelection={rowSelection}
              onClick={this.props.onClick}
              engine={engine}
              model={this.props.model}
              height={this.props.height || '100%'}
              namespace={engine.namespace}
            />
          </div>
        </div>
      )
    }
  }
}

export default TableHoc
