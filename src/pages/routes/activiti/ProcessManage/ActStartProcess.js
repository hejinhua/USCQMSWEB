/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import { dateToFormat } from '../../../../utils/dataToFormat'
import ActStartProcessCmp from '../../../components/activiti/processManage/ActStartProcessCmp'
import { Button, message } from 'antd/lib/index'
import { generatorTableKey } from '../../../../utils/utils'

const ActStartProcess = ({ dispatch, actStartProcess }) => {
  let { list = [], visible, actVisible, pictureUrl, selectedRows } = actStartProcess
  const columns = [
    {
      title: '流程标识',
      dataIndex: 'ID'
    },
    {
      title: '流程名称',
      dataIndex: 'NAME'
    },
    {
      title: '流程版本',
      dataIndex: 'VERSION',
      render(text, record) {
        return <span>V:{record.VERSION}</span>
      }
    },
    {
      title: '流程图',
      dataIndex: 'PNG',
      render(text, record) {
        return (
          <div>
            <Button
              onClick={() => {
                showPicture(record.ID)
              }}
              size='small'
            >
              {record.PNG}
            </Button>
          </div>
        )
      }
    },
    {
      title: '部署时间',
      dataIndex: 'DEPLOYTIME'
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <Button style={{ marginLeft: 5 }} size='small' type='primary' icon='start' onClick={() => start(record.ID)}>
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
      type: 'actStartProcess/dynamicPng',
      payload: { pictureUrl }
    })
  }

  //启动流程
  const start = id => {
    // if (!selectedRows) {
    // message.error('请选择需审批数据！')
    // } else {
    dispatch({
      type: 'actStartProcess/startProcess',
      payload: { id, selectedRows }
    })
    // }
  }

  //流程图modal的关闭
  function Cancel() {
    dispatch({ type: 'actStartProcess/Cancel' })
  }
  //流程modal的关闭
  function actCancel() {
    dispatch({ type: 'actStartProcess/actCancel' })
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
    Cancel,
    actVisible,
    actCancel
  }

  return <ActStartProcessCmp {...props} />
}

function mapStateToProps({ actStartProcess }) {
  return { actStartProcess }
}

export default connect(mapStateToProps)(ActStartProcess)
