import React, { useState, useEffect } from 'react'
import Modal from '../../common/DragModal'
import { Search } from '../../common/Searchs'
import { Tree, message } from 'antd'

import * as commonService from '../../../service/commonService'
import { ergodicRoot, generatorTableKey } from '../../../../utils/utils'

const { TreeNode } = Tree

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

//找父节点
const getParent = (arr, pid) => {
  let temp = []
  const forFn = function(arr, pid) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i]
      if (item.id === pid) {
        temp.push(item)
        forFn(arr, item.pid)
      }
    }
  }
  forFn(arr, pid)
  return temp
}

const NoSelectorForm = ({ visible, onCancel, onOk, editParams }) => {
  const [dataList, setDataList] = useState([])
  const [treeList, setTreeList] = useState([])
  const [expandKeys, setExpandKeys] = useState([])
  const [searchVal, setSearchVal] = useState('')
  const [checkedNode, setCheckedNode] = useState(null)
  const [autoExpand, setAutoExpand] = useState(true)

  useEffect(() => {
    if (visible) {
      let { sql, itemNo } = editParams
      commonService
        .common({
          itemno: 'CODESTANDARD',
          implclass: 'com.usc.app.action.editor.OnSelector',
          condition: `object = '${itemNo}'` + sql
        })
        .then(res => {
          if (res && res.data.flag) {
            const { dataList } = res.data
            setDataList(generatorTableKey(dataList))
            setTreeList(ergodicRoot(generatorTableKey(dataList)))
            setCheckedNode([])
          }
        })
    } else if (!visible && editParams) {
      setTreeList([])
    }
  }, [editParams, visible])

  const Ok = () => {
    if (checkedNode) {
      let parentList = getParent(dataList, checkedNode.PID)
        .filter(i => i.DATATYPE !== 0)
        .reverse()
      parentList.push(checkedNode)
      commonService
        .common({
          itemno: 'CODESTANDARD',
          implclass: 'com.usc.app.action.editor.codegor.AcquisitionCodeAction',
          hData: parentList
        })
        .then(res => {
          if (res && res.data.flag) {
            onOk(res.data.dataList[0])
            message.success('生成编码成功')
          } else {
            message.error('生成编码失败')
          }
        })
    } else {
      message.warning('请选择流水码')
    }
  }

  const onSearch = queryWord => {
    const expandedKeys = dataList
      .map(item => {
        if (item.NAME.indexOf(queryWord) > -1) {
          return getParentKey(item.key, treeList)
        }
        return null
      })
      .filter((item, i, self) => item && self.indexOf(item) === i)
    setSearchVal(queryWord)
    setExpandKeys(expandedKeys)
    setAutoExpand(true)
  }

  const onExpand = expandKeys => {
    setExpandKeys(expandKeys)
    setAutoExpand(false)
  }

  const onSelect = (checkedKey, e) => {
    const { dataRef } = e.node.props
    if (dataRef.DATATYPE !== 2) {
      message.warning('请选择流水码！')
    }
    setCheckedNode(dataRef)
  }

  const loop = data =>
    data.map(item => {
      if (item.TYPE === 'pipeline_code') {
        item.TYPE = '流水码'
      }
      const index = item.NAME.indexOf(searchVal)
      const beforeStr = item.NAME.substr(0, index)
      const afterStr = item.NAME.substr(index + searchVal.length)
      const title = (
        <span>
          {index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchVal}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.NAME}</span>
          )}
          {item.PREFIX ? (
            <span style={{ color: '#e8d098' }}>/{item.PREFIX}</span>
          ) : (
            item.TYPE !== 'block_code' && <span style={{ color: '#1890ff' }}>({item.TYPE})</span>
          )}
        </span>
      )
      if (item.children) {
        return (
          <TreeNode key={item.ID} title={title} dataRef={item}>
            {loop(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.ID} title={title} dataRef={item} />
    })

  return (
    <Modal width={450} okText='生成编码' title='编码生成器' visible={visible} onCancel={onCancel} onOk={Ok}>
      <Search onSearch={onSearch} />
      <Tree autoExpandParent={autoExpand} onSelect={onSelect} expandedKeys={expandKeys} onExpand={onExpand}>
        {loop(treeList)}
      </Tree>
    </Modal>
  )
}

export default NoSelectorForm
