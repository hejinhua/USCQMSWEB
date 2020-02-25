import * as commonService from '../../service/commonService'

export default {
  namespace: 'selectField',
  state: {
    visible: false,
    list: [],
    selectedRowKeys: [],
    selectedRows: []
  },
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *query(
      {
        payload: { ID, onSelect }
      },
      { call, put }
    ) {
      const tableName = 'usc_model_field'
      let { data } = yield call(commonService.get, '/ModelItemRelationInfo/selectByCondition', {
        tableName,
        condition: `rootid='${ID}'`
      })
      yield put({
        type: 'packet',
        payload: { list: data.dataList, onSelect, selectedRowKeys: [], selectedRows: [], visible: true }
      })
    }
  }
}
