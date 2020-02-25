/*
 * @Author: hjh
 * @Date: 2019-07-24 15:58:23
 * @LastEditTime : 2020-01-02 15:22:32
 * @Descripttion: 自动分类页面高阶组件
 */
import React, { Component } from 'react'
import DragCmp from '../../common/DragCmp'
import { Tree, Button, Tooltip } from 'antd'
import { Search } from '../../common/Searchs'

import styles from '../engine.css'

const { TreeNode } = Tree

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.treenodeid === key)) {
        parentKey = node.treenodeid
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

const AutoClassHoc = engine => WrappedComponent => {
  const { classViewNodeList } = engine
  return class extends Component {
    state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      selectedRows: [], // 左边分类树选择节点
      selectedRowKeys: [],
      expandAll: false
    }

    // componentDidUpdate(prevProps) {
    //   const { dataList } = this.props
    //   if (dataList !== prevProps.dataList) {
    //   }
    // }

    onSelect = (selectedKeys, e) => {
      const { dataRef } = e.node.props
      const { loadDataSet } = dataRef
      const selectedNode = JSON.parse(JSON.stringify(dataRef))
      if (selectedNode.children) {
        delete selectedNode.children
      }
      const {
        dispatch,
        model: { params }
      } = this.props
      const { pRecord, itemA, itemNo, relevanceNo } = engine
      this.setState({ selectedRowKeys: [dataRef.treenodeid], selectedRows: [selectedNode] })
      const payload = { showTab: false, selectedRowKeys: [], selectedRows: [] }
      if (loadDataSet) {
        dispatch({
          type: `common/queryAutoClassData`,
          payload: {
            classViewNodeData: selectedNode,
            itemNo,
            viewNo: params ? params.viewNo : relevanceNo,
            itemA,
            itemAData: pRecord,
            namespace: engine.namespace
          }
        })
      } else {
        payload.dataList = []
      }
      dispatch({ type: `${engine.namespace}/packet`, payload })
    }

    onExpand = expandedKeys => {
      this.setState({
        expandedKeys,
        autoExpandParent: false
      })
    }

    onChange = e => {
      const { value } = e.target
      const { list = classViewNodeList, treeData } = this.props.model
      const expandedKeys = list
        .map(item => {
          let { treenodedata, name } = item
          treenodedata = treenodedata || name
          if (treenodedata.indexOf(value) > -1) {
            return getParentKey(item.treenodeid, treeData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    }

    refresh = () => {
      const { dispatch } = this.props
      const { params, menuId: id, facetype, name, icon, itemA, pRecord, pNameSpace, namespace } = engine
      if (itemA) {
        dispatch({
          type: 'common/queryClassViewNode',
          payload: { item: engine, record: pRecord, facetype, pNameSpace }
        })
      } else {
        dispatch({
          type: `tab/query`,
          payload: { params, id, facetype, name, icon }
        })
        dispatch({
          type: `${namespace}/packet`,
          payload: { showTab: false, selectedRowKeys: [], selectedRows: [] }
        })
      }
    }

    toogleExpandAll = () => {
      const { expandAll } = this.state
      this.setState({ expandAll: !expandAll })
      this.onChange({ target: { value: expandAll ? '``' : '' } })
    }

    render() {
      const { searchValue, expandedKeys, autoExpandParent, selectedRowKeys, expandAll } = this.state
      const loop = data =>
        data.map(item => {
          let { treenodedata, name, nodeDataTotal, summary } = item
          treenodedata = treenodedata || name
          const index = treenodedata.indexOf(searchValue)
          const beforeStr = treenodedata.substr(0, index)
          const afterStr = treenodedata.substr(index + searchValue.length)
          const title = (
            <span>
              {beforeStr}
              {index > -1 ? <span style={{ color: '#f50' }}>{searchValue}</span> : treenodedata}
              {afterStr}
              {summary && nodeDataTotal ? (
                <span style={{ color: '#52c41a', marginLeft: '5px' }}>({nodeDataTotal})</span>
              ) : null}
            </span>
          )
          if (item.children) {
            return (
              <TreeNode key={item.treenodeid} title={title} dataRef={item}>
                {loop(item.children)}
              </TreeNode>
            )
          }
          return <TreeNode key={item.treenodeid} title={title} dataRef={item} />
        })
      return (
        <div className={styles.flexX}>
          <DragCmp width='20%' canResizing={{ right: true }} showTab={true}>
            <div className={styles.flexY}>
              <div className={styles.flexNoHigh}>
                <div className={styles.search}>
                  <Search onChange={this.onChange} />
                </div>
                <Button type='primary' className='other_btn' onClick={this.refresh} icon='sync' />
              </div>
              <div className={styles.flexNoHigh}>
                <Tree
                  onSelect={this.onSelect}
                  selectedKeys={selectedRowKeys}
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                >
                  {loop(this.props.model.treeData || [])}
                </Tree>
                <Tooltip title={`${expandAll ? '收起' : '展开'}全部节点`}>
                  <Button
                    type='link'
                    icon={expandAll ? 'up' : 'down'}
                    onClick={this.toogleExpandAll}
                    style={{ height: '38px' }}
                  />
                </Tooltip>
              </div>
            </div>
          </DragCmp>
          <div className={styles.flexGrowX}>
            <WrappedComponent {...this.props} />
          </div>
        </div>
      )
    }
  }
}
export default AutoClassHoc
