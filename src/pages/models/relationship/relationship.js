import * as commonService from '../../service/commonService'
import { message } from 'antd'

const tableName = 'usc_model_relationship'
export default {
  namespace: 'relationship',
  state: {
    visible: false,
    list: [],
    selectedRows: [],
    selectedRowKeys: [],
    menuList: []
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
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, showTab: false, selectedRowKeys: [], selectedRows: [] }
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
        let res = { tableName, data: [values], VER: 0 }
        data = yield call(commonService.post, '/sysItemWork/create', res)
      }
      if (data.data) {
        message.success(data.data.info)
        yield put({ type: 'query' })
        yield put({ type: 'packet', payload: { visible: false } })
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
        message.success(data.info)
        yield put({ type: 'query' })
      }
    },
    *recovery({ payload }, { call, put }) {
      let { data } = yield call(commonService.post, '/sysModelItem/recovery', {
        tableName,
        data: [payload.record]
      })
      if (data) {
        message.success('恢复成功!')
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
        condition: `ITEMID='${PID}'`
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
        yield put({ type: 'query' })
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
    *search({ payload }, { call, put }) {
      payload.tableName = tableName
      let { data } = yield call(commonService.get, '/sysModelItem/query', payload)
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, showTab: false, selectedRowKey: [], selectedRows: [] }
        })
      }
    }
  }
}
