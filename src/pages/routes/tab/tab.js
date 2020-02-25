import React from 'react'
import TabCmp from '../../components/tab/TabCmp'
import { connect } from 'dva'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
const TabRoute = ({ dispatch, tab, loading }) => {
  let { panes, activeKey } = tab
  let onChange = activeKey => {
    dispatch({ type: 'tab/changeTab', payload: { activeKey } })
  }
  const closeTab = (e, data) => {
    const { type, tabKey } = data
    dispatch({ type: 'tab/closeTab', payload: { type, tabKey } })
  }
  const collect = props => {
    return { tabKey: props.tabKey }
  }
  const onEdit = targetKey => {
    closeTab(null, { type: 1, tabKey: targetKey })
  }

  let tabProps = { panes, activeKey, onChange, loading, closeTab, collect, onEdit }
  return <TabCmp {...tabProps} />
}

//将tabModel中state转为props
function mapStateToProps({ tab, loading }) {
  return { tab, loading: loading.global }
}
//输出可表格拖拽组件
export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(TabRoute))
