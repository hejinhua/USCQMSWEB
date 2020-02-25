/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import ActRunProcessCmp from '../../../components/activiti/processManage/ActRunProcessCmp'
import { Button } from 'antd/lib/index'
import { generatorTableKey } from '../../../../utils/utils'

const ActRunProcess = ({ dispatch, actRunProcess }) => {
  let { list = [], processInstanceId = '' } = actRunProcess
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
        return (
          <a href='#' style={{ color: '#009688' }}>
            [进行中]:{record.state}
          </a>
        )
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
            <Button
              style={{ marginLeft: 5 }}
              onClick={() => showOpinion(record.processInstanceId)}
              size='small'
              type='primary'
            >
              作废
            </Button>
          </div>
        )
      }
    }
  ]

  list = generatorTableKey(list)
  //刷新
  const refresh = () => {
    dispatch({ type: 'actRunProcess/query' })
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

  const showOpinion = processInstanceId => {
    //弹窗标题
    const title = '作废原因'
    //后端请求路径
    const url = '/act/process/endProcess'
    //前端刷新页面请求
    const refreshUrl = 'actRunProcess/query'
    dispatch({ type: 'processOpinion/show', payload: { processInstanceId, title, url, refreshUrl } })
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

  return <ActRunProcessCmp {...props} />
}

function mapStateToProps({ actRunProcess }) {
  return { actRunProcess }
}

export default connect(mapStateToProps)(ActRunProcess)
