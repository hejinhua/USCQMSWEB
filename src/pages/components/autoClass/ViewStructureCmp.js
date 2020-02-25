/*
 * @Author: hjh
 * @Date: 2019-07-29 13:56:31
 * @LastEditTime : 2020-01-03 09:18:40
 * @Descripttion: 视图结构树组件
 */

import React from 'react'
import { Tree, Button } from 'antd'
import DragCmp from '../common/DragCmp'
import ViewStructureForm from './ViewStructureForm'

import { ergodicRoot } from '../../../utils/utils'

const { TreeNode } = Tree
const renderTreeNodes = data =>
  data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.NAME} key={item.ID} dataRef={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode key={item.ID} title={item.NAME} dataRef={item} />
  })

const ViewStructureCmp = ({ createNode, del, list, selectedRowKeys, onTreeSelect, selectedRows, onOk, disabled }) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <DragCmp width='20%' canResizing={{ right: true }} showTab={true}>
        <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
          <Button disabled={disabled} onClick={createNode} style={{ marginRight: '5px' }} type='primary'>
            新建节点
          </Button>
          <Button
            onClick={del}
            type='primary'
            disabled={disabled || (selectedRows[0] && selectedRows[0].PID !== '0' ? false : true)}
          >
            删除
          </Button>
          <Tree onSelect={onTreeSelect} selectedKeys={selectedRowKeys}>
            {renderTreeNodes(ergodicRoot(list))}
          </Tree>
        </div>
      </DragCmp>
      <div style={{ flexGrow: '1', width: '5px', height: '100%', overflow: 'auto' }}>
        <ViewStructureForm disabled={disabled} record={selectedRows && selectedRows[0]} onOk={onOk} list={list} />
      </div>
    </div>
  )
}

export default ViewStructureCmp
