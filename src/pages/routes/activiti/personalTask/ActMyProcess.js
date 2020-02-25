/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import ActMyProcessCmp from '../../../components/activiti/personalTask/ActMyProcessCmp'
import { Button } from 'antd/lib/index'
import { generatorTableKey, showConfirm } from '../../../../utils/utils'

const ActMyProcess = ({ dispatch, actMyProcess }) => {
  let { list = [], processInstanceId = '' } = actMyProcess
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
      title: '状态',
      dataIndex: 'state',
      render(text, record) {
        let state = record.state
        if (state === 'completed') {
          state = '[正常结束]'
          return <a href='#'>{state}</a>
        }
        if (state.includes('进行中')) {
          return (
            <a href='#' style={{ color: '#009688' }}>
              {state}
            </a>
          )
        }
        return <span style={{ color: 'red' }}>{state}</span>
      }
    },
    {
      title: '发起人',
      dataIndex: 'startName'
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
            {record.state.includes('进行中') ? (
              <Button
                style={{ marginLeft: 5 }}
                onClick={() => showConfirm(() => revoke(record.processInstanceId), '确定要撤销吗？')}
                size='small'
                type='primary'
              >
                撤销
              </Button>
            ) : null}
          </div>
        )
      }
    }
  ]

  list = generatorTableKey(list)
  //刷新
  const refresh = () => {
    dispatch({ type: 'actMyProcess/query' })
  }
  //打开进展流程图模态框
  const getProgress = processInstanceId => {
    dispatch({ type: 'processActivityPng/show', payload: { processInstanceId } })
  }
  //打开详情页面
  const getDetails = processInstanceId => {
    //模态框标题
    const title = '详情页'
    dispatch({ type: 'processActinst/getActinst', payload: { processInstanceId, title } })
  }
  //用户撤销
  const revoke = processInstanceId => {
    dispatch({ type: 'actMyProcess/revoke', payload: { processInstanceId } })
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
    columns,
    processInstanceId
  }

  return <ActMyProcessCmp {...props} />
}

function mapStateToProps({ actMyProcess }) {
  return { actMyProcess }
}

export default connect(mapStateToProps)(ActMyProcess)
