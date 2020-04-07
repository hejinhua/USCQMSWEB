/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import ActEndProcessCmp from '../../../components/activiti/processManage/ActEndProcessCmp'
import { Button } from 'antd/lib/index'
import { generatorTableKey, showConfirm } from '../../../../utils/utils'

const ActEndProcess = ({ dispatch, actEndProcess }) => {
  let { list = [] } = actEndProcess
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
      title: '发起人',
      dataIndex: 'startName'
    },
    {
      title: '发起时间',
      dataIndex: 'startTime'
    },
    {
      title: '结束时间',
      dataIndex: 'endTime'
    },
    {
      title: '流程状态',
      dataIndex: 'processState',
      render(text, record) {
        let processState = ''
        if (record.processState === 'completed') {
          processState = '[正常结束]'
          return (
            <a style={{ color: 'green' }} href='#'>
              {processState}
            </a>
          )
        }
        return <span style={{ color: 'red' }}>{record.processState}</span>
      }
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
              onClick={() => getProgress(record.processInstanceId)}
            >
              进度
            </Button>
            <Button
              style={{ marginLeft: 5 }}
              size='small'
              type='primary'
              onClick={() => getDetails(record.processInstanceId)}
            >
              详情
            </Button>
            <Button
              style={{ marginLeft: 5 }}
              onClick={() => showConfirm(() => deleteProcess(record.processInstanceId))}
              size='small'
              type='primary'
            >
              删除
            </Button>
          </div>
        )
      }
    }
  ]

  list = generatorTableKey(list)
  //刷新
  const refresh = () => {
    dispatch({ type: 'actEndProcess/query' })
  }
  //打开进展流程图模态框
  const getProgress = processInstanceId => {
    dispatch({ type: 'processActivityPng/show', payload: { processInstanceId } })
  }
  //打开详情页面模态框
  const getDetails = processInstanceId => {
    //模态框标题
    const title = '详情页'
    dispatch({ type: 'processActinst/getActinst', payload: { processInstanceId, title } })
  }
  //删除流程
  const deleteProcess = processInstanceId => {
    dispatch({ type: 'actEndProcess/deleteProcess', payload: { processInstanceId } })
  }

  //总条数
  const pagination = {
    showTotal: total => `共 ${total} 条`,
    //每页条数
    pageSize: 10
  }

  let props = {
    dispatch,
    list,
    pagination,
    refresh,
    columns
  }

  return <ActEndProcessCmp {...props} />
}

function mapStateToProps({ actEndProcess }) {
  return { actEndProcess }
}

export default connect(mapStateToProps)(ActEndProcess)
