/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'

export default {
  namespace: 'actRunProcess',
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
      let data = yield call(commonService.post, '/act/process/getRunProcess')
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.data }
        })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const index = location.pathname.indexOf('_')
        const id = location.pathname.substr(index)
        switch (location.pathname) {
          case `/act/activiti/ProcessManage/ActRunProcess${id}`:
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
