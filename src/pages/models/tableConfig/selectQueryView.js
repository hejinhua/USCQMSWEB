import * as commonService from '../../service/commonService'

export default {
  namespace: 'selectQueryView',
  state: {
    visible: false,
    list: []
  },
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *query(
      {
        payload: { selectedItemNo, tableName = 'usc_model_queryview', onSelect }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.get, '/sysModelItem/packet', {
        tableName,
        condition: `ITEMNO='${selectedItemNo}'`
      })
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, visible: true, selectedRowKeys: [], selectedRows: [], onSelect }
        })
      }
    }
  }
}
