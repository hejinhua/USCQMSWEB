/*
 * @Author: hjh
 * @Date: 2019-07-24 15:58:23
 * @LastEditTime: 2019-11-26 17:18:33
 * @Descripttion: 单个页面高阶组件
 */
import React, { Component } from 'react'

const SingleHoc = engine => WrappedComponent => {
  return class extends Component {
    onClick(record) {
      const namespace = engine.namespace
      this.props.dispatch({
        type: `${namespace}/packet`,
        payload: { selectedRowKeys: [record.key], selectedRows: [record] }
      })
    }

    render() {
      return (
        <div className='full_screen'>
          <WrappedComponent {...this.props} onClick={this.onClick.bind(this)} />
        </div>
      )
    }
  }
}
export default SingleHoc
