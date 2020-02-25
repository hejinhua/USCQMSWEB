import * as commonService from '../../service/commonService'

export default {
  namespace: 'selectItemNo',
  state: {
    list: [],
    selectedRowKeys: [],
    selectedRows: []
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  //异步
  effects: {
    *query({ payload = {} }, { call, put }) {
      const { condition, onSelect } = payload
      let params = { tableName: 'usc_model_item', condition }
      let { data } = yield call(commonService.get, '/sysModelItem/packet', params)
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, selectedRowKeys: [], selectedRows: [], visible: true, onSelect }
        })
      }
    },
    *search({ payload }, { call, put }) {
      payload.tableName = 'usc_model_item'
      let { data } = yield call(commonService.get, '/sysModelItem/query', payload)
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList }
        })
      }
    }
  }
}
