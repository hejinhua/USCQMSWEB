/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import { dateToFormat } from '../../../../utils/dataToFormat'
import ActModelCmp from '../../../components/activiti/modelManage/ActModelCmp'
import { Button, Popconfirm } from 'antd/lib/index'

const ActModel = ({ dispatch, actModel }) => {
  let { total, list = [], processTypes, record, visible, val } = actModel
  const columns = [
    //   {
    //   title: '流程分类',
    //   dataIndex: 'category',
    //   align:'center',
    //   render: (text, record) => {
    //     return <a>{record.category}</a>
    //   },
    // },
    {
      title: '模型标识',
      dataIndex: 'key'
    },
    {
      title: '模型名称',
      dataIndex: 'name'
    },
    {
      title: '模型描述',
      dataIndex: 'metaInfo.description'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateTime'
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
              icon='link'
              onClick={() => {
                designModel(record.id)
              }}
            >
              在线设计
            </Button>
            <Popconfirm title='确定要部署吗?' onConfirm={() => deployModel(record.id)}>
              <Button style={{ marginLeft: 5 }} size='small' type='primary' icon='pushpin'>
                部署
              </Button>
            </Popconfirm>
            <Popconfirm title='确定要删除吗?' onConfirm={() => del(record.id)}>
              <Button style={{ marginLeft: 5 }} type='danger' icon='delete' size='small'>
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  list.map(item => {
    item.createTime = dateToFormat(item.createTime)
    item.lastUpdateTime = dateToFormat(item.lastUpdateTime)
  })
  //打开设计器
  const designModel = id => {
    let href = window.location.href
    let hostPort = href.split('//')[1].split('/')[0]
    window.open(`http://${hostPort}/activiti-explorer/modeler.html?modelId=` + id)
  }
  //部署模型
  const deployModel = id => {
    dispatch({
      type: 'actModel/deployModel',
      payload: { id: id }
    })
  }
  // //选中流程分类鼠标移入回调
  // function onMouseEnter() {
  //   dispatch({type:"actModel/getProcessTypes"});
  // }

  //修改的时候弹出model
  function showModel(record) {
    dispatch({ type: 'actModel/editModel', payload: record })
  }

  //添加的时候弹出model
  function showM() {
    let record = {}
    dispatch({ type: 'actModel/editModel', payload: record })
  }

  //删除
  function del(id) {
    dispatch({
      type: 'actModel/del',
      payload: { id }
    })
  }

  //点击关闭或者x的时候关闭model
  function onCancel() {
    dispatch({ type: 'actModel/cancel' })
  }

  //刷新
  function refresh() {
    dispatch({ type: 'actModel/query' })
  }

  //分页
  function onPage() {
    if (val) {
      //判断是什么查询 存在val就是条件查询后的分页
      dispatch({ type: 'actModel/queryLike' })
    } else {
      dispatch({ type: 'actModel/query' })
    }
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
    visible,
    onCancel,
    showM,
    record,
    refresh,
    columns,
    processTypes,
    showModel
    // onMouseEnter
  }

  return <ActModelCmp {...props} />
}

function mapStateToProps({ actModel }) {
  return { actModel }
}

export default connect(mapStateToProps)(ActModel)
