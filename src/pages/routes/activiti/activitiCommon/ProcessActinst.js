/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import ProcessActinstCmp from '../../../components/activiti/activitiCommon/ProcessActinstCmp'
import { generatorTableKey } from '../../../../utils/utils'
import ProcessOpinion from './ProcessOpinion'

const ProcessActinst = ({ dispatch, processActinst }) => {
  let {
    engine = [],
    list = [],
    processReverseList = [],
    visible,
    title,
    isShowButtons = false,
    taskId,
    processInstanceId,
    userVisible,
    userTreeList = [],
    selectedRowKey = [],
    selectedRows = [],
    expandedRowKeys = [],
    userList = []
  } = processActinst

  const processColumns = [
    {
      title: '执行环节',
      dataIndex: 'actName'
    },
    {
      title: '执行人',
      dataIndex: 'assignee'
    },
    {
      title: '开始时间',
      dataIndex: 'startTime'
    },
    {
      title: '结束时间',
      dataIndex: 'endTime'
    },
    {
      title: '提交意见',
      dataIndex: 'subOpinions'
    },
    {
      title: '任务历时',
      dataIndex: 'duration'
    }
  ]

  processReverseList = generatorTableKey(processReverseList)
  //关闭模态框
  const onCancel = () => {
    dispatch({
      type: 'processActinst/onCancel'
    })
  }
  //同意
  const agree = () => {
    //弹窗标题
    const title = '办理建议'
    //后端请求路径
    const url = `/task/handle/${taskId}`
    //前端刷新页面请求
    const refreshUrl = 'actTaskToDo/query'
    dispatch({
      type: 'processOpinion/show',
      payload: { processInstanceId, title, url, refreshUrl }
    })
  }
  //驳回
  const reject = () => {
    //弹窗标题
    const title = '驳回原因'
    //后端请求路径
    const url = `/task/reject/${taskId}`
    //前端刷新页面请求
    const refreshUrl = 'actTaskToDo/query'
    dispatch({
      type: 'processOpinion/show',
      payload: { processInstanceId, title, url, refreshUrl }
    })
  }
  // 任务转办
  const onOk = () => {
    dispatch({
      type: 'processActinst/taskTransfer',
      payload: { taskId, name: selectedRows[0].name }
    })
  }

  const showUsers = () => {
    dispatch({
      type: 'processActinst/showUsers'
    })
  }
  const toogleUser = () => {
    dispatch({
      type: 'processActinst/toogleUser'
    })
  }
  const selectChange = (selectedRowKey, selectedRows) => {
    dispatch({ type: 'processActinst/onSelectChange', payload: { selectedRowKey, selectedRows } })
  }
  const onExpandedRowsChange = expandedRowKeys => {
    dispatch({
      type: 'processActinst/onExpandedRowsChange',
      payload: expandedRowKeys
    })
  }
  const getParentkeys = (arr, pid) => {
    let temp = []
    const forFn = function(arr, pid) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i]
        if (item.id === pid) {
          temp.push(item.id)
          forFn(arr, item.pid)
        }
      }
    }
    forFn(arr, pid)
    return temp
  }
  const onSearchUser = queryWord => {
    let expandedRowKeys = []
    const list = userList.filter(i => i.name.indexOf(queryWord) > -1)
    list.forEach(j => {
      expandedRowKeys = expandedRowKeys.concat(getParentkeys(userList, j.id))
    })
    dispatch({
      type: 'processActinst/onExpandedRowsChange',
      payload: [...new Set(expandedRowKeys)]
    })
  }
  let props = {
    dispatch,
    processInstanceId,
    engine,
    list,
    processReverseList,
    visible,
    onCancel,
    processColumns,
    title,
    isShowButtons,
    agree,
    reject,
    showUsers,
    userVisible,
    toogleUser,
    userTreeList,
    selectChange,
    selectedRowKey,
    selectedRows,
    onOk,
    expandedRowKeys,
    onExpandedRowsChange,
    onSearchUser
  }

  return (
    <div>
      <ProcessActinstCmp {...props} />
      <ProcessOpinion list={list} />
    </div>
  )
}

function mapStateToProps({ processActinst }) {
  return { processActinst }
}

export default connect(mapStateToProps)(ProcessActinst)
