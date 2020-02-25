import * as commonService from '../../service/commonService'
import { message } from 'antd'

const tableName = 'usc_model_queryview'
export default {
  namespace: 'queryView',
  state: {
    visible: false,
    menuList: [],
    list: [],
    selectedRows: [],
    selectedRowKeys: []
  },
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *query({ payload = {} }, { call, put }) {
      const { sql } = payload
      let { data } = yield call(commonService.get, '/sysModelItem/packet', { tableName, condition: sql })
      let data2 = yield call(commonService.get, '/sysModelItem/packet', {
        tableName: 'usc_model_item',
        condition: "TYPE in ('0','1')"
      })
      if (data && data2.data) {
        let itemList = []
        data2.data.dataList.forEach(i => {
          const { NAME, ID, ITEMNO } = i
          itemList.push({ NAME, ID, ITEMNO })
        })
        yield put({
          type: 'packet',
          payload: { list: data.dataList, itemList, showTab: false, selectedRowKeys: [], selectedRows: [] }
        })
      }
    },
    *addOrEdit(
      {
        payload: { values, oldValues }
      },
      { call, put }
    ) {
      let data = {}
      if (values.ID) {
        let upValues = { tableName, data: [oldValues], uData: values }
        data = yield call(commonService.post, '/ModelItemRelationInfo/update', upValues)
      } else {
        let newValues = { tableName, data: [values], VER: 0 }
        data = yield call(commonService.post, '/sysItemWork/create', newValues)
      }
      if (data.data) {
        yield put({ type: 'query' })
        message.success(data.data.info)
      }
    },
    *del(
      {
        payload: { record }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, '/sysModelItem/delete', { tableName, data: [record] })
      if (data) {
        yield put({ type: 'query' })
        message.success(data.info)
      }
    },
    *upgrade({ payload }, { call, put }) {
      let { data } = yield call(commonService.post, '/model/upgradeModel', {
        data: payload.selectedRow,
        tableName
      })
      if (data) {
        message.success(data.info)
        yield put({ type: 'query', payload: { sql: `state IN('C','U')` } })
      }
    },
    *getRelationMenu(
      {
        payload: { PID }
      },
      { call, put }
    ) {
      const tableName = 'usc_model_itemmenu'
      let { data } = yield call(commonService.get, '/ModelItemRelationInfo/selectByCondition', {
        tableName,
        condition: `ITEMID='${PID}'`
      })
      yield put({ type: 'packet', payload: { PID, menuList: data.dataList } })
    },
    *recovery({ payload }, { call, put }) {
      let { data } = yield call(commonService.post, '/sysModelItem/recovery', { tableName, data: [payload.record] })
      if (data) {
        message.success('恢复成功!')
        yield put({ type: 'query' })
      }
    },
    *synchro({ payload }, { call, put }) {
      let { data } = yield call(commonService.post, '/modelSynchronous/single', {
        data: payload.selectedRow,
        tableName
      })
      if (data) {
        message.success(data.info)
        yield put({ type: 'query' })
      }
    }
  }
}
