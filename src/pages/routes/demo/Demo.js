/**
 *@author lwp
 */
import React from 'react'
import DemoCmp from '../../components/demo/DemoCmp'
import { connect } from 'dva'

const Demo = ({ dispatch, demo }) => {
  let { noticeList = [], selectedRowKey, relationTabs = [] } = demo
  const onSelectChange = (selectedRowKey, selectedRows) => {
    dispatch({ type: 'demo/selection', payload: { selectedRowKey, selectedRows } })
    dispatch({ type: 'demo/getUnqualified', payload: { selectedRowKey } })
  }
  let onRow = record => ({
    onClick: () => {
      onSelectChange(record.ID, record)
      if (record.STATUS === 0) {
        dispatch({
          type: 'demo/markedRead',
          payload: { selectedRowKey: record.ID, selectedRows: record, noticeList: noticeList }
        })
      }
      dispatch({ type: 'demo/getNoticeRelationTab', payload: { selectedRowKey: record.ID, selectedRow: record } })
    }
  })
  //页面前面的选框
  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }
  let props = {
    dispatch,
    rowSelection,
    noticeList,
    onSelectChange,
    onRow,
    selectedRowKey,
    relationTabs
  }
  return <DemoCmp {...props} />
}

//将model中state转为props
function mapStateToProps({ demo }) {
  return { demo }
}

export default connect(mapStateToProps)(Demo)
