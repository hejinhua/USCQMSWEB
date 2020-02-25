import * as commonService from '../../service/commonService'

const tableName = 'usc_model_relationship'
export default {
  namespace: 'selectRelation',
  state: {
    visible: false,
    list: []
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *query(
      {
        payload: { condition, onSelect }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.get, '/sysModelItem/packet', { tableName, condition })
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, visible: true, selectedRowKeys: [], selectedRows: [], onSelect }
        })
      }
    }
  }
}
