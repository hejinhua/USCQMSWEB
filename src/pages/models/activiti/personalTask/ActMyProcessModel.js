/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'
import { message } from 'antd'

export default {
  namespace: 'actMyProcess',
  state: {},
  reducers: {
    packet(
      state,
      {
        payload: { list }
      }
    ) {
      return { ...state, list }
    }
  },
  effects: {
    //查询流程
    *query({}, { call, put }) {
      const userName = localStorage.getItem('userName')
      let data = yield call(commonService.post, '/act/task/getMyProcess', { userName: userName })
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.data }
        })
      }
    },
    *revoke(
      {
        payload: { processInstanceId }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, '/act/task/processRevoke', { processInstanceId: processInstanceId })
      if (data.flag) {
        message.success(data.msg)
        yield put({
          type: 'query'
        })
      } else {
        message.error(data.msg)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const index = location.pathname.indexOf('_')
        const id = location.pathname.substr(index)
        switch (location.pathname) {
          case `/act/activiti/personalTask/ActMyProcess${id}`:
            dispatch({
              type: 'query',
              payload: {}
            })
            break
          default:
        }
      })
    }
  }
}
