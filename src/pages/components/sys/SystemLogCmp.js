/*
 * @Author: hjh
 * @Date: 2019-07-29 13:57:11
 * @LastEditTime: 2019-09-19 14:29:39
 * @Descripttion: 配置平台组件
 */

import React from 'react'
import DragCmp from '../common/DragCmp'
import { Tree, DatePicker, InputNumber, Button } from 'antd'
import PropertyForm from '../engine/property/PropertyForm'
import Modal from '../common/DragModal'
import ScrollTable from '../common/scrollTable/ScrollTable'

const { TreeNode } = Tree
const treeData = [
  {
    title: '事件查看器',
    key: '1',
    children: [
      {
        title: '系统日志',
        key: '1-1',
        action: 'S',
        children: [
          { title: '登录系统', key: '1-1-1', action: 'LOGIN' },
          { title: '退出系统', key: '1-1-2', action: 'LOGOUT' }
        ]
      },
      {
        title: '数据日志',
        action: 'D',
        key: '1-2',
        children: [
          { title: '新建', key: '1-2-1', action: 'NEW' },
          { title: '修改', key: '1-2-2', action: 'MODIFY' },
          { title: '删除', key: '1-2-3', action: 'DELETE' }
        ]
      },
      {
        title: '文件日志',
        action: 'F',
        key: '1-3',
        children: [
          { title: '上传', key: '1-3-1', action: 'UPLOAD' },
          { title: '下载', key: '1-3-2', action: 'DOWNLOAD' },
          { title: '浏览', key: '1-3-3', action: 'BROWSE' }
        ]
      },
      {
        title: '备份日志',
        action: 'B',
        key: '1-4'
      },
      {
        title: '其它',
        key: '1-5',
        action: 'OTHER'
      }
    ]
  }
]

const renderTreeNodes = data =>
  data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode title={item.title} key={item.key} dataRef={item} />
  })
const SystemLogCmp = ({
  toogleModal,
  dataList,
  columns,
  onSelect,
  onDoubleClick,
  selectedRowKey,
  visible,
  record,
  pageFieldList
}) => {
  const onValidTimeChange = (date, dateString) => {
    console.log(date, dateString)
  }
  const onBackupTimeChange = (date, dateString) => {
    console.log(date, dateString)
  }

  const onClick = () => {}
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex' }}>
      <DragCmp width='15%' canResizing={{ right: true }} showTab={true}>
        <Tree defaultExpandAll={true} onSelect={onSelect} selectedKeys={selectedRowKey}>
          {renderTreeNodes(treeData)}
        </Tree>
      </DragCmp>
      <div style={{ flexGrow: '1', height: '100%', width: '5px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px', display: 'flex', lineHeight: '32px' }}>
          筛选日志：
          <DatePicker onChange={onValidTimeChange} placeholder='日志有效时间' />
          <div style={{ marginLeft: '25px' }}>数据库自动备份间隔时间：</div>
          <InputNumber min={1} onChange={onBackupTimeChange} />天
          <Button onClick={onClick} style={{ marginLeft: '25px' }} type='primary'>
            手工备份
          </Button>
        </div>
        <div style={{ width: '100%', flexGrow: '1', height: '5px' }}>
          <ScrollTable list={dataList} columns={columns} onDoubleClick={onDoubleClick} />
        </div>
      </div>
      <Modal title='明细信息' width={700} visible={visible} onOk={toogleModal} onCancel={toogleModal}>
        <PropertyForm columns={1} pageFieldList={pageFieldList} showBtn={false} record={record} />
      </Modal>
    </div>
  )
}
export default SystemLogCmp
