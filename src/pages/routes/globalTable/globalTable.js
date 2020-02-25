/*
 * @Author: hjh
 * @Date: 2019-12-16 13:53:29
 * @LastEditTime : 2019-12-30 14:18:18
 * @Descripttion: 全局表格
 */

import React from 'react'
import { connect } from 'dva'
import GlobalTableCmp from '../../components/globalTable/GlobalTableCmp'
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import { stateMap } from '../../../utils/paramsConfig'
import { showConfirm } from '../../../utils/utils'

const columns = [
  {
    title: '状态',
    dataIndex: 'STATE',
    width: 80,
    render(text) {
      return stateMap[text]
    }
  },
  {
    title: '标识',
    dataIndex: 'NO',
    width: 200,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '名称',
    dataIndex: 'NAME',
    width: 200,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  },
  {
    title: '表格类型',
    dataIndex: 'TYPE',
    align: 'center',
    width: 200,
    render: text => {
      return (
        <Ellipsis tooltip lines={1}>
          {text ? '普通表格' : '树形表格'}
        </Ellipsis>
      )
    }
  },
  {
    title: '备注',
    dataIndex: 'REMARK',
    width: 100,
    render(text) {
      return (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      )
    }
  }
]
const GlobalTable = ({ dispatch, globalTable, isModeling }) => {
  let { list, record, visible, selectedRowKeys, disabled = true, selectedRows, PID, showTab } = globalTable

  const { STATE, EFFECTIVE } = selectedRows[0] || {}

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const { ID } = selectedRows[0]
    dispatch({
      type: 'globalTable/packet',
      payload: { selectedRowKeys, selectedRows, disabled: !isModeling, showTab: true, PID: ID }
    })
    dispatch({ type: 'globalField/query', payload: { PID: ID } })
  }

  const toogleModal = (record = {}) => {
    dispatch({ type: 'globalTable/packet', payload: { record, visible: !visible } })
  }

  const del = record => {
    dispatch({ type: 'globalTable/del', payload: { record } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }

  const closeTab = () => {
    dispatch({ type: 'globalTable/packet', payload: { showTab: false } })
  }

  const synchro = selectedRow => {
    dispatch({ type: 'globalTable/synchro', payload: { selectedRow } })
  }

  const showSysObject = sql => {
    dispatch({ type: 'globalTable/query', payload: { sql } })
  }

  const btns = [
    {
      name: `选择显示关系`,
      btns: [
        {
          name: '显示已同步关系',
          func: () => {
            showSysObject(`state IN('F')`)
          }
        },
        {
          name: '显示设计中关系',
          disabled: !isModeling,
          func: () => {
            showSysObject(`state IN('C','U')`)
          }
        }
      ]
    },
    {
      name: '新建',
      disabled: !isModeling,
      func: () => {
        toogleModal()
      }
    },
    {
      name: '修改',
      disabled: !isModeling || !selectedRows[0],
      func: () => {
        toogleModal(selectedRows[0])
      }
    },
    {
      name: '删除',
      disabled: !(isModeling && selectedRows[0]),
      func: () => {
        showConfirm(() => {
          del(selectedRows[0])
        })
      }
    },
    {
      name: '同步建模',
      disabled: !(isModeling && selectedRows[0] && (STATE === 'C' || STATE === 'U' || (STATE === 'F' && !EFFECTIVE))),
      func: () => {
        showConfirm(() => {
          synchro(selectedRows[0])
        }, '确认同步当前选择数据？')
      }
    }
  ]

  const tableProps = { btns, list, rowSelection, columns }
  const formProps = { record, visible, title: '全局表格', toogleModal }
  const props = { showTab, disabled, PID, tableProps, formProps, closeTab }

  return <GlobalTableCmp {...props} />
}

function mapStateToProps({ globalTable, user: { isModeling } }) {
  return { globalTable, isModeling }
}

export default connect(mapStateToProps)(GlobalTable)
