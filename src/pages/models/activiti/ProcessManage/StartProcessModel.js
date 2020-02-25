/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'
import { message } from 'antd/lib/index'

export default {
  namespace: 'startProcess',
  state: {
    visible: false
  },
  reducers: {
    packet(
      state,
      {
        payload: { data }
      }
    ) {
      return { ...state, ...data }
    },
    dynamicPng(
      state,
      {
        payload: { pictureUrl }
      }
    ) {
      state.visible = !state.visible
      state.pictureUrl = pictureUrl
      return { ...state }
    },
    Cancel(state) {
      return { ...state, visible: false }
    }
  },
  effects: {
    /*打开modal显示数据*/
    *query({}, { call, put }) {
      let { data } = yield call(commonService.get, '/act/process/getProcdefProcess')
      if (data) {
        yield put({
          type: 'packet',
          payload: { data }
        })
      }
    },
    *startProcess(
      {
        payload: { id, selectedRows }
      },
      { call, put }
    ) {
      const queryParam = {}
      queryParam.id = id
      queryParam.userName = localStorage.getItem('userName')
      queryParam.selectedRows = selectedRows
      //清空选中的数据
      yield put({
        type: 'actTest/cleanSelectChange'
      })
      let { data } = yield call(commonService.post, '/act/process/startProcess', queryParam)
      if (data.result) {
        message.success('启动成功！')
        yield put({
          type: 'actCancel'
        })
        //查询刷新数据状态
        yield put({
          type: 'actTest/query'
        })
      } else {
        message.error('启动失败！')
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const path = location.pathname
        const index = path.indexOf('_')
        const id = path.substr(index)
        switch (location.pathname) {
          case `/act/startProcess${id}`:
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
