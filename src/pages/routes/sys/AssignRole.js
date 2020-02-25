/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva'
import AssignRoleCmp from '../../components/sys/AssignRoleCmp'

const AssignRole = ({ dispatch, assignRole }) => {
  let { visible, rolesList = [], userHasRolesList = [], rolesIdList = [], userId } = assignRole
  //角色分配modal的关闭
  function cancel() {
    dispatch({ type: 'assignRole/cancel' })
  }
  let props = { dispatch, visible, cancel, rolesList, userHasRolesList, rolesIdList, userId }
  return <AssignRoleCmp {...props} />
}
//将nva-model中state转为props
function mapStateToProps({ assignRole }) {
  return { assignRole }
}

//将nva-model关联到当前组件上
export default connect(mapStateToProps)(AssignRole)
