/**
 * @author lwp
 */
import * as commonService from '../../service/commonService'
import { message } from 'antd'

export default {
  namespace: 'assignRole',
  state: {
    visible: false
  },
  reducers: {
    packet(
      state,
      {
        payload: { rolesList, userHasRolesList, rolesIdList, userId }
      }
    ) {
      return { ...state, rolesList, userHasRolesList, rolesIdList, userId }
    },
    showModal(state) {
      return { ...state, visible: true }
    },
    cancel(state) {
      return { ...state, visible: false }
    }
  },
  effects: {
    *query(
      {
        payload: { selectedRows }
      },
      { call, put }
    ) {
      yield put({
        type: 'showModal'
      })
      if (selectedRows[0]) {
        let { data } = yield call(commonService.common, {
          itemNo: 'SROLE',
          condition: selectedRows[0].ID,
          implclass: 'com.usc.app.action.editor.GetRoles'
        })
        if (data.flag) {
          let rolesIdList = []
          data.dataList[0].userHasRolesList.forEach(i => {
            rolesIdList.push(i.ID)
          })
          yield put({
            type: 'packet',
            payload: {
              rolesList: data.dataList[0].rolesList,
              userHasRolesList: data.dataList[0].userHasRolesList,
              rolesIdList,
              userId: selectedRows[0].ID
            }
          })
        }
      } else {
        message.warning('未获得用户信息')
      }
    },
    *saveAndUpdate(
      {
        payload: { targetKeys, userHasRolesList, userId }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.common, {
        itemNo: 'SR_SRPLE_OBJ',
        condition: { targetKeys, userHasRolesList, userId },
        implclass: 'com.usc.app.action.editor.AssignRoles'
      })
      if (data.flag) {
        message.success(data.info)
        yield put({
          type: 'cancel'
        })
      } else {
        message.error(data.info)
      }
    }
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen((location) => {})
    // }
  }
}
