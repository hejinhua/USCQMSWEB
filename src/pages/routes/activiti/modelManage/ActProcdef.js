/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import { showConfirm, generatorTableKey } from '../../../../utils/utils'
import { dateToFormat } from '../../../../utils/dataToFormat'
import ActProcdefCmp from '../../../components/activiti/modelManage/ActProcdefCmp'
import { Button } from 'antd/lib/index'

const ActProcdef = ({ dispatch, actProcdef }) => {
  let { list = [], visible, pictureUrl, selectedRowKey, ACT_PROCESSMANAGE_ITEMCmp = () => <div /> } = actProcdef
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
          <div>
            {record.SUSPENSIONSTATE ? (
              <Button
                style={{ marginLeft: 5 }}
                size='small'
                type='primary'
                icon='pushpin'
                onClick={() => showConfirm(() => activation(record.ID), '确定要激活吗?')}
              >
                激活
              </Button>
            ) : (
              <Button
                style={{ marginLeft: 5 }}
                size='small'
                type='primary'
                icon='pushpin'
                onClick={() => showConfirm(() => suspension(record.ID), '确定要挂起吗?')}
              >
                挂起
              </Button>
            )}
            <Button
              style={{ marginLeft: 5 }}
              type='danger'
              icon='delete'
              size='small'
              onClick={() => showConfirm(() => del(record.DEPLOYMENTID), '正在进行的流程也会删除,确定删除吗?')}
            >
              删除
            </Button>
          </div>
        )
      }
    }
  ]

  list = generatorTableKey(list)
  list.map(item => {
    item.DEPLOYTIME = dateToFormat(item.DEPLOYTIME)
  })
  //挂起流程
  const suspension = id => {
    dispatch({
      type: 'actProcdef/suspension',
      payload: { id }
    })
  }
  //挂起流程
  const activation = id => {
    dispatch({
      type: 'actProcdef/activation',
      payload: { id }
    })
  }

  //删除
  function del(deploymentId) {
    dispatch({
      type: 'actProcdef/del',
      payload: { deploymentId }
    })
  }

  //查看流程图
  const showPicture = id => {
    let url = `api/act/process/dynamicPng/${id}`
    changePicture(url)
  }
  const changePicture = pictureUrl => {
    dispatch({
      type: 'actProcdef/dynamicPng',
      payload: { pictureUrl }
    })
  }

  //刷新
  function refresh() {
    dispatch({ type: 'actProcdef/query' })
  }

  //总条数
  const pagination = {
    showTotal: total => `共 ${total} 条`,
    //每页条数
    pageSize: 10
  }

  //数据选择相关
  const onRow = (selectedRowKey, selectedRows) => {
    //往指定的model放入选中数据，以便后端获取选中数据ID
    dispatch({ type: 'ACT_PROCESSMANAGE_ITEMCmp/packet', payload: { pRecord: selectedRows } })
    //选中数据查询关联的对象数据
    dispatch({ type: 'actProcdef/getRelItem', payload: { selectedRowKey } })
    dispatch({ type: 'actProcdef/selectChange', payload: { selectedRowKey, selectedRows } })
  }
  const onSelectChange = (selectedRowKey, selectedRows) => {
    //往指定的model放入选中数据，以便后端获取选中数据ID
    dispatch({ type: 'ACT_PROCESSMANAGE_ITEMCmp/packet', payload: { pRecord: selectedRows[0] } })
    //选中数据查询关联的对象数据
    dispatch({ type: 'actProcdef/getRelItem', payload: { selectedRowKey: selectedRowKey[0] } })
    dispatch({ type: 'actProcdef/selectChange', payload: { selectedRowKey, selectedRows } })
  }
  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }

  let props = {
    list,
    pagination,
    refresh,
    columns,
    visible,
    pictureUrl,
    changePicture,
    rowSelection,
    onRow,
    ACT_PROCESSMANAGE_ITEMCmp
  }

  return <ActProcdefCmp {...props} />
}

function mapStateToProps({ actProcdef }) {
  return { actProcdef }
}

export default connect(mapStateToProps)(ActProcdef)
