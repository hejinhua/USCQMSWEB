/*
 * @Author: hjh
 * @Date: 2019-07-24 15:58:23
 * @LastEditTime : 2020-01-03 17:28:16
 * @Descripttion: 分类关联页面高阶组件
 */
import React, { Component } from 'react'
import DragCmp from '../../common/DragCmp'
import { Tree, Button, Tooltip } from 'antd'
import { Search } from '../../common/Searchs'

import { ergodicRoot } from '../../../../utils/utils'
import { showContextMenu } from '../../../../utils/contextMenuFunc'

import styles from '../engine.css'

const { TreeNode } = Tree

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.ID === key)) {
        parentKey = node.ID
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
const ClassRelationHoc = engine => WrappedComponent => {
  const classNamespace = engine.itemModel.itemNo + '_' + engine.menuId

  const rootNode = {
    NO: '0',
    DEL: 0,
    PID: '0',
    ID: '0',
    STATE: 'F',
    USC_OBJECT: 'CLASS_NODE',
    ITEMNO: engine.itemModel.itemNo,
    NAME: `${engine.name}分类对象`
  }
  return class extends Component {
    state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      expandAll: false
    }

    componentDidMount() {
      const { menuId, params, classNodeModel, itemModel, facetype, namespace } = engine
      itemModel.menuId = menuId
      itemModel.params = params
      itemModel.itemA = classNodeModel.itemNo
      this.props.dispatch({
        type: `popup/loadSubpage`,
        payload: {
          itemRelationPage: [itemModel],
          record: {},
          facetype,
          pNameSpace: namespace,
          menuId,
          itemA: classNodeModel.itemNo
        }
      })
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.engine !== this.props.engine) {
        this.props.dispatch({
          type: `${classNamespace}/packet`,
          payload: { showTab: false, selectedRowKeys: [], selectedRows: [], dataList: [] }
        })
      }
    }

    onSelect = (selectedKeys, e) => {
      const { dataRef } = e.node.props
      const selectedNode = JSON.parse(JSON.stringify(dataRef))
      if (selectedNode.children) {
        delete selectedNode.children
      }
      const { dispatch, model } = this.props
      const { itemNo, classItemNo, classNodeItemNo } = model.params
      dispatch({
        type: `${engine.namespace}/packet`,
        payload: { selectedRowKeys: [selectedNode.ID], selectedRows: [selectedNode] }
      })
      engine.itemModel.pRecord = selectedNode
      if (selectedNode.ID !== '0') {
        dispatch({
          type: `common/queryClassNodeData`,
          payload: { pRecord: selectedNode, itemNo, classItemNo, namespace: classNamespace, classNodeItemNo }
        })
      }
      dispatch({
        type: `${classNamespace}/packet`,
        payload: { showTab: false, selectedRowKeys: [], selectedRows: [] }
      })
    }

    onRightClick = ({ event, node }) => {
      const { dataRef, eventKey } = node.props
      if (eventKey === '0') return
      const { pageX, pageY } = event
      const { model } = this.props
      const { selectedRowKeys, params } = model
      const selectedNode = JSON.parse(JSON.stringify(dataRef))
      if (selectedNode.children) {
        delete selectedNode.children
      }
      if (!selectedRowKeys || selectedRowKeys[0] !== eventKey) {
        this.onSelect([eventKey], { node })
        model.selectedRows = [selectedNode]
        model.selectedRowKeys = [eventKey]
      }
      showContextMenu({
        model,
        engine: engine.classNodeModel,
        left: pageX,
        top: pageY,
        hData: [selectedNode],
        itemNo: params.classItemNo
      })
    }

    onExpand = expandedKeys => {
      this.setState({
        expandedKeys,
        autoExpandParent: false
      })
    }

    onChange = e => {
      const { value } = e.target
      const { dataList } = this.props.model
      const expandedKeys = dataList
        .map(item => {
          if (item.NAME.indexOf(value) > -1) {
            const list = ergodicRoot(dataList)
            rootNode.children = list
            return getParentKey(item.ID, [rootNode])
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
      const { params, menuId: id, facetype, name, icon } = engine
      dispatch({
        type: `tab/query`,
        payload: { params, id, facetype, name, icon }
      })
    }

    toogleExpandAll = () => {
      const { expandAll } = this.state
      this.setState({ expandAll: !expandAll })
      this.onChange({ target: { value: expandAll ? '``' : '' } })
    }

    render() {
      const { searchValue, expandedKeys, autoExpandParent, expandAll } = this.state
      const { model } = this.props
      const { dataList = [], selectedRowKeys, panes } = model
      engine.classNodeModel.namespace = engine.namespace
      engine.classNodeModel.classNamespace = classNamespace
      const loop = data =>
        data.map(item => {
          const index = item.NAME.indexOf(searchValue)
          const beforeStr = item.NAME.substr(0, index)
          const afterStr = item.NAME.substr(index + searchValue.length)
          const title =
            index > -1 ? (
              <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
              </span>
            ) : (
              <span>{item.NAME}</span>
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
      let list = ergodicRoot(dataList)
      rootNode.children = list
      return (
        <div className={styles.flexX}>
          <DragCmp width='20%' canResizing={{ right: true }} showTab={true}>
            <div className={styles.flexY}>
              <WrappedComponent {...this.props} />
              <div className={styles.flexNoHigh}>
                <div className={styles.search}>
                  <Search onChange={this.onChange} />
                </div>
                <Button type='primary' className='other_btn' onClick={this.refresh} icon='sync' />
              </div>
              <div className={styles.flexNoHigh}>
                <Tree
                  onSelect={this.onSelect}
                  onRightClick={this.onRightClick}
                  selectedKeys={selectedRowKeys}
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                >
                  {loop([rootNode])}
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
          <div className={styles.flexGrowX}>{panes[0] && panes[0].content}</div>
        </div>
      )
    }
  }
}
export default ClassRelationHoc
