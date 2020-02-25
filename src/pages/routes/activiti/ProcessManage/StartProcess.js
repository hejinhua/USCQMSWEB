/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import { dateToFormat } from '../../../../utils/dataToFormat'
import StartProcessCmp from '../../../components/activiti/processManage/StartProcessCmp'
import { Button } from 'antd/lib/index'
import { generatorTableKey } from '../../../../utils/utils'

const StartProcess = ({ dispatch, startProcess }) => {
  let { list = [], visible, pictureUrl } = startProcess
  const columns = [
    {
      title: '流程标识',
      dataIndex: 'id'
    },
    {
      title: '流程名称',
      dataIndex: 'name'
    },
    {
      title: '流程版本',
      dataIndex: 'version',
      render(text, record) {
        return <span>V:{record.version}</span>
      }
    },
    {
      title: '流程图',
      dataIndex: 'png',
      render(text, record) {
        return (
          <div>
            <Button
              onClick={() => {
                showPicture(record.id)
              }}
              size='small'
            >
              {record.png}
            </Button>
          </div>
        )
      }
    },
    {
      title: '部署时间',
      dataIndex: 'deployTime'
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <Button
            style={{ marginLeft: 5 }}
            size='small'
            type='primary'
            icon='start'
            onClick={() => openStartProcess(record.id)}
          >
            启动
          </Button>
        )
      }
    }
  ]

  list = generatorTableKey(list)
  list.map(item => {
    item.deployTime = dateToFormat(item.deployTime)
  })

  //查看流程图
  const showPicture = id => {
    let url = `api/act/process/dynamicPng/${id}`
    changePicture(url)
  }
  const changePicture = pictureUrl => {
    dispatch({
      type: 'startProcess/dynamicPng',
      payload: { pictureUrl }
    })
  }

  //启动流程
  const openStartProcess = id => {
    dispatch({
      type: 'actProcess/show',
      payload: { procdefId: id }
    })
  }

  //流程图modal的关闭
  function Cancel() {
    dispatch({ type: 'startProcess/Cancel' })
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
    columns,
    visible,
    pictureUrl,
    changePicture,
    Cancel
  }

  return <StartProcessCmp {...props} />
}

function mapStateToProps({ startProcess }) {
  return { startProcess }
}

export default connect(mapStateToProps)(StartProcess)
