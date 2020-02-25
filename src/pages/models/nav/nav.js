import * as commonService from '../../service/commonService'
import { message } from 'antd'

const tableName = 'usc_model_navigation'
export default {
  namespace: 'nav',
  state: {
    visible: false,
    list: [],
    selectedRowKeys: [],
    selectedRows: [],
    menuList: []
  },
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *query({}, { call, put }) {
      let { data } = yield call(commonService.get, '/ModelItemRelationInfo/getSysMenu', { tableName })
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, showTab: false, selectedRowKeys: [], selectedRows: [] }
        })
      }
    },
    *addOrEdit(
      {
        payload: { values, PID, oldValues }
      },
      { call, put }
    ) {
      let newValues = { tableName, data: values }
      let upValues = { tableName, data: oldValues, uData: values }
      let data = {}
      if (values.ID) {
        data = yield call(commonService.post, '/ModelItemRelationInfo/update', upValues)
      } else {
        newValues.data.PID = PID
        data = yield call(commonService.post, '/ModelItemRelationInfo/createSysMenu', newValues)
      }
      if (data.data) {
        message.success(data.data.info)
        yield put({ type: 'packet', payload: { visible: false, visibleParams: false } })
        yield put({ type: 'query' })
      }
    },
    *del({ payload }, { call, put }) {
      let values = { tableName, data: [payload.values] }
      let { data } = yield call(commonService.post, '/ModelItemRelationInfo/delete', values)
      if (data) {
        message.success(data.info)
        yield put({ type: 'query' })
      }
    },
    *getRelationMenu(
      {
        payload: { PID }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.get, '/ModelItemRelationInfo/selectByCondition', {
        tableName: 'usc_model_itemmenu',
        condition: `itemid='${PID}'`
      })
      yield put({ type: 'packet', payload: { PID, menuList: data.dataList } })
    },
    *synchro({ payload }, { call, put }) {
      let { data } = yield call(commonService.post, '/modelSynchronous/single', {
        data: payload.selectedRow,
        tableName
      })
      if (data) {
        message.success(data.info)
        yield put({ type: 'query', payload: {} })
      }
    }
  }
}
