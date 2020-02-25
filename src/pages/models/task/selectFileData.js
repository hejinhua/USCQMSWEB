import * as commonService from '../../service/commonService'

export default {
  namespace: 'selectFileData',
  state: {
    visible: false,
    list: [],
    selectedRowKey: [],
    selectedRows: [],
    gridFieldList: []
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
      const { itemNo, itemGridNo, condition } = payload
      let { data } = yield call(commonService.post, '/sysModelToWbeClient/getModel/gridData', { itemNo, itemGridNo })
      let data2 = yield call(commonService.common, {
        itemNo,
        itemGridNo,
        implclass: 'com.usc.app.query.QuerySingleItemData',
        condition
      })
      if (data && data2.data) {
        yield put({
          type: 'packet',
          payload: {
            gridFieldList: data.gridFieldList,
            list: data2.data.dataList,
            selectedRowKey: [],
            selectedRows: []
          }
        })
      }
    }
  }
}
