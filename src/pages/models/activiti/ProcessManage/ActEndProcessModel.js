/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'
import { message } from 'antd'

export default {
  namespace: 'actEndProcess',
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
      let { data } = yield call(commonService.post, '/act/process/getEndProcess', { userName: userName })
      if (data.flag) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList }
        })
      }
    },
    //删除流程
    *deleteProcess(
      {
        payload: { processInstanceId }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, '/act/process/deleteProcess', {
        processInstanceId: processInstanceId
      })
      if (data.flag) {
        message.success(data.info)
        yield put({
          type: 'query'
        })
      } else {
        message.success(data.info)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const index = location.pathname.indexOf('_')
        const id = location.pathname.substr(index)
        switch (location.pathname) {
          case `/act/activiti/ProcessManage/ActEndProcess${id}`:
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
