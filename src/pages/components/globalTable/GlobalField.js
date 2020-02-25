/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime: 2019-12-16 16:11:14
 * @Descripttion: 对象表格组件
 */

import React from 'react'
import { connect } from 'dva'
import { Select } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import GlobalFieldForm from './GlobalFieldForm'
import { showConfirm } from '../../../utils/utils'

const Option = Select.Option
const Grid = ({ dispatch, globalField, PID, disabled }) => {
  let { visible, record, selectedRowKeys, selectedRows, list } = globalField

  const columns = [
    {
      title: '字段标识',
      dataIndex: 'NO',
      width: 100
    },
    {
      title: '字段名称',
      dataIndex: 'NAME',
      width: 100
    },
    {
      title: '列宽',
      dataIndex: 'WIDTH',
      width: 60
    },
    {
      title: '对齐方式',
      dataIndex: 'ALIGN',
      width: 120,
      render: (text, record) => {
        return (
          <Select
            disabled={disabled}
            style={{ width: '80%' }}
            onChange={value => {
              updateSingleVal(value, record, 'ALIGN')
            }}
            value={text}
          >
            <Option value='left'>左对齐</Option>
            <Option value='center'>居中</Option>
            <Option value='right'>右对齐</Option>
          </Select>
        )
      }
    }
  ]

  const updateSingleVal = (value, record, field) => {
    if (disabled) return
    const values = {}
    values[field] = value.target ? value.target.checked : value
    dispatch({
      type: `globalField/addOrEdit`,
      payload: { values, record, PID }
    })
  }

  const toogleModal = (record = {}) => {
    dispatch({ type: 'globalField/packet', payload: { record, visible: !visible } })
  }

  const del = record => {
    dispatch({
      type: 'globalField/del',
      payload: { ID: record.ID, STATE: record.STATE, PID }
    })
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    dispatch({ type: 'globalField/packet', payload: { selectedRowKeys, selectedRows } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys
  }

  const btns = [
    {
      name: '新建',
      disabled,
      func: () => {
        toogleModal()
      }
    },
    {
      name: '修改',
      disabled: disabled || !selectedRows[0],
      func: () => {
        toogleModal(selectedRows[0])
      }
    },
    {
      name: '删除',
      disabled: disabled || !selectedRows[0],
      func: () => {
        showConfirm(() => {
          del(selectedRows[0])
        })
      }
    }
  ]
  const props = {
    list,
    columns,
    btns,
    listName: 'list',
    tableName: 'usc_model_grid_field',
    canDragRow: !disabled,
    rowSelection
  }

  const formProps = { visible, toogleModal, PID, record, list }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TableWithBtn {...props} />
      <GlobalFieldForm {...formProps} />
    </div>
  )
}

function mapStateToProps({ globalField }) {
  return { globalField }
}

export default connect(mapStateToProps)(Grid)
