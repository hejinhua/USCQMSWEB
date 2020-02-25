/*
 * @Author: hjh
 * @Date: 2019-08-12 14:20:48
 * @LastEditTime: 2019-12-12 10:07:04
 * @Descripttion: 权限页面高阶组件
 */
import { Component } from 'react'
import { Tree, Button, message, Icon } from 'antd'
import { Search } from '../../common/Searchs'

import { ergodicRoot } from '../../../../utils/utils'
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

const AuthorityHoc = engine => WrappedComponent => {
  return class extends Component {
    state = {
      checkedKeys: [],
      searchValue: '',
      expandedKeys: [],
      autoExpandParent: true
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        checkedKeys: nextProps.model.dataList[1] || []
      })
    }

    onCheck = (checkedKeys, info) => {
      const { checkedNodes, halfCheckedKeys } = info
      this.checkedNodes = checkedNodes
      this.halfCheckedKeys = halfCheckedKeys
      this.setState({ checkedKeys: checkedKeys })
    }

    onClick = () => {
      const checkedNodes = this.checkedNodes
      const halfCheckedKeys = this.halfCheckedKeys
      if (checkedNodes) {
        const { dataList, pRecord, itemNo } = this.props.model
        let halfCheckedData = dataList[0].filter(data => halfCheckedKeys.find(key => key === data.ID))
        let checkedData = checkedNodes.map(item => (delete item.props.dataRef.children, item.props.dataRef))
        halfCheckedData.map(item => (item.checkedState = 2))
        checkedData.map(item => (item.checkedState = 1))
        const nAuthArray = checkedData.concat(halfCheckedData)
        this.props.dispatch({
          type: 'common/save',
          payload: {
            values: {
              nAuthArray,
              hAuthArray: dataList[1],
              hHalfAuthArray: dataList[2],
              hData: [pRecord],
              itemNo,
              implclass: 'com.usc.app.sys.AuthorizeAction'
            },
            namespace: engine.namespace
          },
          callback: (flag, data) => {
            if (flag) {
              this.setState({
                checkedKeys: data.dataList[1]
              })
            } else {
              this.setState({
                checkedKeys: this.props.model.dataList[1] || []
              })
            }
          }
        })
      } else {
        message.warning('请选择权限')
      }
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
      const expandedKeys = dataList[0]
        .map(item => {
          if (item.name.indexOf(value) > -1) {
            const list = ergodicRoot(dataList[0])
            return getParentKey(item.ID, list)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      this.setState({
        searchValue: value,
        expandedKeys,
        autoExpandParent: true
      })
    }
    render() {
      const { dataList } = this.props.model
      const { searchValue, expandedKeys, autoExpandParent } = this.state
      const loop = data =>
        data.map(item => {
          const { name, ID, type } = item
          let twoToneColor =
            type === 'edit' ? '#eb2f96' : type === 'api' ? '#52c41a' : type === 'home' ? '#1890FF' : '#9400D3'
          const icon = <Icon type={type} theme='twoTone' twoToneColor={twoToneColor} />
          const index = name.indexOf(searchValue)
          const beforeStr = name.substr(0, index)
          const afterStr = name.substr(index + searchValue.length)
          const title =
            index > -1 ? (
              <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
              </span>
            ) : (
              <span>{name}</span>
            )
          if (item.children) {
            return (
              <TreeNode key={ID} title={title} dataRef={item} icon={icon}>
                {loop(item.children)}
              </TreeNode>
            )
          }
          return <TreeNode key={ID} title={title} dataRef={item} icon={icon} />
        })
      let props = {}
      if (expandedKeys.length > 0) props = { expandedKeys }
      return (
        <div className={styles.authScroll}>
          <div className={styles.authBtn}>
            <Search onChange={this.onChange} />
            <Button className={styles.marginLeft} type='primary' onClick={() => this.onClick()} icon='check-circle'>
              保存
            </Button>
          </div>
          {dataList && dataList[0] && (
            <Tree
              checkable
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              defaultExpandAll={true}
              showIcon
              onExpand={this.onExpand}
              {...props}
              autoExpandParent={autoExpandParent}
            >
              {loop(ergodicRoot(dataList[0]))}
            </Tree>
          )}
          <WrappedComponent style={{ marginTop: 8 }} {...this.props} />
        </div>
      )
    }
  }
}
export default AuthorityHoc
