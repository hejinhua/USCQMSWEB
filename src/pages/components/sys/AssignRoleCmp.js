/**
 * @author lwp
 */
import React from 'react'
import { Modal, Transfer, Tree } from 'antd'
import { showConfirm } from '../../../utils/utils'
const { TreeNode } = Tree

const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1
}

const generateTree = (treeNodes = [], checkedKeys = []) => {
  treeNodes.map(i => {
    i.title = i.NAME
  })
  return treeNodes.map(({ children, ...props }) => (
    <TreeNode {...props} disabled={checkedKeys.includes(props.key) || !Number(props.TYPE)} key={props.key}>
      {generateTree(children, checkedKeys)}
    </TreeNode>
  ))
}

const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
  const transferDataSource = []
  function flatten(list = []) {
    list.forEach(item => {
      transferDataSource.push(item)
      flatten(item.children)
    })
  }
  flatten(dataSource)
  return (
    <Transfer
      listStyle={{ width: 300 }}
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      render={item => item.title}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys]
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              onCheck={(
                _,
                {
                  node: {
                    props: { eventKey }
                  }
                }
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey))
              }}
              onSelect={(
                _,
                {
                  node: {
                    props: { eventKey }
                  }
                }
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey))
              }}
            >
              {generateTree(dataSource, targetKeys)}
            </Tree>
          )
        }
      }}
    </Transfer>
  )
}

class AssignRoleCmp extends React.Component {
  state = {
    targetKeys: this.props.rolesIdList,
    rolesList: this.props.rolesList
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ rolesList: nextProps.rolesList, targetKeys: nextProps.rolesIdList })
  }
  onChange = targetKeys => {
    this.setState({ targetKeys })
  }
  onOk = () => {
    //修改后的角色id数组以及原有的角色数组传到后台对比做相应增删
    this.props.dispatch({
      type: 'assignRole/saveAndUpdate',
      payload: {
        targetKeys: this.state.targetKeys,
        userHasRolesList: this.props.userHasRolesList,
        userId: this.props.userId
      }
    })
  }
  render() {
    const { targetKeys, rolesList } = this.state
    return (
      <Modal
        width={700}
        title='分配角色'
        visible={this.props.visible}
        onCancel={this.props.cancel}
        onOk={
          this.state.targetKeys.length > 0
            ? this.onOk
            : () => showConfirm(() => this.onOk(), '此用户还未设置角色是否继续？')
        }
        destroyOnClose='true'
        centered={true}
        mask={false}
        maskClosable={false}
      >
        <TreeTransfer dataSource={rolesList} targetKeys={targetKeys} onChange={this.onChange} />
      </Modal>
    )
  }
}

export default AssignRoleCmp
