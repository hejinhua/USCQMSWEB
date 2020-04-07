/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'

export default {
  namespace: 'actTaskToDo',
  state: {
    pictureUrl: ''
  },
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
      let { data } = yield call(commonService.post, '/act/task/getTaskToDo', { userName: userName })
      if (data.flag) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList }
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
          case `/act/activiti/personalTask/ActTaskToDo${id}`:
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
