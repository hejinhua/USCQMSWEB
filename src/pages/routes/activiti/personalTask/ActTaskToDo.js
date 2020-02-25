/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import ActTaskToDoCmp from '../../../components/activiti/personalTask/ActTaskToDoCmp'
import { Button } from 'antd/lib/index'
import { generatorTableKey } from '../../../../utils/utils'

const ActTaskToDo = ({ dispatch, actTaskToDo }) => {
  let { list = [] } = actTaskToDo
  const columns = [
    {
      title: '实例标题',
      dataIndex: 'title'
    },
    {
      title: '流程名称',
      dataIndex: 'name'
    },
    {
      title: '当前环节',
      dataIndex: 'link'
    },
    {
      title: '发起人',
      dataIndex: 'startName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <Button
              style={{ marginLeft: 5 }}
              size='small'
              type='primary'
              onClick={() => showActinst(record.id, record.processInstanceId)}
            >
              办理
            </Button>
            <Button
              style={{ marginLeft: 5 }}
              size='small'
              type='primary'
              onClick={() => getProgress(record.processInstanceId)}
            >
              进度
            </Button>
          </div>
        )
      }
    }
  ]

  list = generatorTableKey(list)
  //刷新
  const refresh = () => {
    dispatch({ type: 'actTaskToDo/query' })
  }
  //打开任务办理页面(任务id办理任务，实例id获取流转信息)
  const showActinst = (taskId, processInstanceId) => {
    const title = '任务办理'
    const isShowButtons = true
    dispatch({ type: 'processActinst/getActinst', payload: { taskId, processInstanceId, title, isShowButtons } })
  }
  //打开进展流程图模态框
  const getProgress = processInstanceId => {
    dispatch({ type: 'processActivityPng/show', payload: { processInstanceId } })
  }

  //总条数
  const pagination = {
    showTotal: total => `共 ${total} 条`,
    //每页条数
    pageSize: 10
  }

  let props = {
    list,
    pagination,
    refresh,
    columns
  }

  return <ActTaskToDoCmp {...props} />
}

function mapStateToProps({ actTaskToDo }) {
  return { actTaskToDo }
}

export default connect(mapStateToProps)(ActTaskToDo)
