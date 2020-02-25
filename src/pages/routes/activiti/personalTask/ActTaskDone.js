/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import ActTaskDoneCmp from '../../../components/activiti/personalTask/ActTaskDoneCmp'
import { Button } from 'antd/lib/index'
import { generatorTableKey } from '../../../../utils/utils'

const ActTaskDone = ({ dispatch, actTaskDone }) => {
  let { list = [] } = actTaskDone
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
      title: '办理时间',
      dataIndex: 'endTime'
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
              详情
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
    const title = '办理详情'
    dispatch({ type: 'processActinst/getActinst', payload: { taskId, processInstanceId, title } })
  }

  //总条数
  const pagination = {
    showTotal: (total) => `共 ${total} 条`,
    //每页条数
    pageSize: 10
  }

  let props = {
    list,
    pagination,
    refresh,
    columns
  }

  return <ActTaskDoneCmp {...props} />
}

function mapStateToProps({ actTaskDone }) {
  return { actTaskDone }
}

export default connect(mapStateToProps)(ActTaskDone)
