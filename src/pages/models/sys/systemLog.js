import * as commonService from '../../service/commonService'
import { notification } from 'antd'

export default {
  namespace: 'systemLog',
  state: {
    visible: false,
    record: null,
    selectedRows: [],
    selectedRowKey: [],
    dataList: []
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    },
    toogleModal(state, { payload }) {
      const visible = !state.visible
      return { ...state, ...payload, visible }
    }
  },
  effects: {
    *queryWithAction({ payload }, { call, put }) {
      const { action } = payload
      let { data } = yield call(commonService.get, '/log/details', { action })
      if (data) {
        if (data.flag) {
          yield put({ type: 'packet', payload: { dataList: data.dataList } })
        } else {
          notification.error({
            message: data.info,
            duration: 0
          })
        }
      }
    }
  }
}
