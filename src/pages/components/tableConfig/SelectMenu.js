/*
 * @Author: hjh
 * @Date: 2019-07-30 16:22:04
 * @LastEditTime: 2019-12-18 10:42:42
 * @Descripttion: 选择菜单组件
 */

import React from 'react'
import { connect } from 'dva'
import { message } from 'antd'
import TableWithBtn from '../common/TableWithBtn'
import MenuForm from './MenuForm'
import Modal from '../common/DragModal'
import { showConfirm } from '../../../utils/utils'

const columns = [
  {
    title: '事务标识',
    dataIndex: 'NO',
    width: 100
  },
  {
    title: '业务名称',
    dataIndex: 'NAME',
    width: 100
  },
  {
    title: '实现类',
    dataIndex: 'IMPLCLASS',
    width: 200
  },
  {
    title: '菜单类型',
    dataIndex: 'MTYPE',
    width: 80,
    render(text) {
      return <span>{text === 1 ? '业务菜单' : text === 2 ? '系统菜单' : '关联菜单'}</span>
    }
  },
  {
    title: '请求参数',
    dataIndex: 'REQPARAM'
  }
]
const SelectMenu = ({ selectMenu, dispatch }) => {
  const { visible, list, selectedRowKey, selectedRows, menuVisible, record = {}, onSelect } = selectMenu

  const toogleModal = () => {
    dispatch({ type: 'selectMenu/packet', payload: { visible: false } })
  }

  const toogleEdit = type => {
    if (type === 1) {
      if (selectedRows.length > 0) {
        dispatch({ type: 'selectMenu/packet', payload: { record: selectedRows[0], menuVisible: !menuVisible } })
      } else {
        message.warning('请选择数据~')
      }
    } else {
      dispatch({ type: 'selectMenu/packet', payload: { record: {}, menuVisible: !menuVisible } })
    }
  }

  const del = () => {
    if (selectedRows.length > 0) {
      showConfirm(() => {
        dispatch({ type: 'selectMenu/del', payload: { record: selectedRows[0] } })
      })
    } else {
      message.warning('请选择数据~')
    }
  }

  const Ok = () => {
    if (selectedRows[0]) {
      onSelect(selectedRows[0])
      toogleModal()
    } else {
      message.warn('请选择数据~')
    }
  }

  const onSelectChange = (selectedRowKey, selectedRows) => {
    dispatch({ type: 'selectMenu/packet', payload: { selectedRowKey, selectedRows } })
  }

  const rowSelection = {
    type: 'radio',
    onChange: onSelectChange,
    selectedRowKeys: selectedRowKey
  }
  const onSearch = () => {}
  const btns = [
    {
      name: '新建',
      func: () => {
        toogleEdit(0)
      }
    },
    {
      name: '修改',
      func: () => {
        toogleEdit(1)
      }
    },
    {
      name: '删除',
      func: () => {
        del()
      }
    }
  ]
  const props = { onSearch, list, columns, btns, rowSelection, height: 400 }
  return (
    <Modal width={800} title='选择菜单' visible={visible} onOk={Ok} onCancel={toogleModal}>
      <TableWithBtn {...props} />
      <MenuForm visible={menuVisible} record={record} toogleModal={toogleEdit} width={650} title='编辑菜单' />
    </Modal>
  )
}

function mapStateToProps({ selectMenu }) {
  return { selectMenu }
}

export default connect(mapStateToProps)(SelectMenu)
