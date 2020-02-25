import * as commonService from '../../service/commonService'
import { message, notification } from 'antd'
import { compareUpdate } from '../../../utils/utils'

const processActiviKey = (activeKey, type) => {
  let tableName = ''
  let namespace = ''
  let listName = ''
  switch (activeKey) {
    case '1':
      tableName = 'usc_model_field'
      namespace = 'field'
      listName = 'fieldList'
      break
    case '2':
      tableName = 'usc_model_itemmenu'
      namespace = 'menus'
      listName = 'menuList'
      break
    case '3':
      tableName = type ? 'usc_model_property' : 'usc_model_property_field'
      namespace = 'property'
      listName = type ? 'propertyList' : 'propertyItemList'
      break
    case '4':
      tableName = type ? 'usc_model_grid' : 'usc_model_grid_field'
      namespace = 'grid'
      listName = type ? 'gridList' : 'gridItemList'
      break
    case '5':
      tableName = type ? 'usc_model_relationpage' : 'usc_model_relationpage_sign'
      namespace = 'relation'
      listName = type ? 'relationList' : 'relationItemList'
      break
    default:
      break
  }
  return {
    tableName,
    namespace,
    listName
  }
}
export default {
  namespace: 'tableConfig',
  state: {
    list: [],
    visible: false,
    record: null,
    selectedRowKey: [],
    selectedRows: [],
    pid: '',
    fieldList: [],
    menuList: [],
    propertyList: [],
    propertyItemList: [],
    gridList: [],
    gridItemList: [],
    relationList: [],
    relationItemList: [],
    activeKey: '1',
    showTab: false
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    },
    toogleModal(state, { payload }) {
      const visible = !state.visible
      return { ...state, ...payload, visible }
    },
    clearItemData(state) {
      return {
        ...state,
        fieldList: [],
        menuList: [],
        propertyList: [],
        propertyItemList: [],
        gridList: [],
        gridItemList: [],
        relationList: [],
        relationItemList: []
      }
    }
  },
  //异步
  effects: {
    *query({ payload = {} }, { call, put, select }) {
      const tableName = 'usc_model_item'
      let { sql } = payload
      if (!sql) {
        sql = yield select(state => state.tableConfig.sql) || 'SITEM=0'
      }
      let { data } = yield call(commonService.get, '/sysModelItem/packet', { tableName, condition: sql })
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, sql, showTab: false, selectedRowKey: [], selectedRows: [] }
        })
      }
    },
    *queryInvalid({}, { call, put }) {
      let { data } = yield call(commonService.get, '/sysModelItem/getAbolishedItem')
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, showTab: false, selectedRowKey: [], selectedRows: [] }
        })
      }
    },
    *search({ payload }, { call, put }) {
      payload.tableName = 'usc_model_item'
      let { data } = yield call(commonService.get, '/sysModelItem/query', payload)
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, showTab: false, selectedRowKey: [], selectedRows: [] }
        })
      }
    },
    *upgrade({ payload }, { call, put }) {
      let { data } = yield call(commonService.post, '/model/upgradeModel', {
        data: payload.selectedRow,
        tableName: 'usc_model_item'
      })
      if (data) {
        message.success(data.info)
        yield put({ type: 'query', payload: { sql: `state IN('C','U')` } })
      }
    },
    *synchro({ payload }, { call, put }) {
      let { data } = yield call(commonService.post, '/modelSynchronous/single', {
        data: payload.selectedRow,
        tableName: 'usc_model_item'
      })
      if (data) {
        message.success(data.info)
        yield put({ type: 'query', payload: {} })
      }
    },
    *addOrEdit(
      {
        payload: { values, record }
      },
      { call, put }
    ) {
      let data = {}
      const userName = localStorage.getItem('userName')
      const tableName = 'usc_model_item'
      const newValues = { userName, tableName, data: values }
      if (values.ID) {
        const isUpdate = compareUpdate(values, record)
        if (isUpdate) {
          newValues.data = record
          newValues.uData = values
          data = yield call(commonService.post, '/ModelItemRelationInfo/update', newValues)
        } else {
          message.success('没有改变数据')
          yield put({
            type: 'toogleModal'
          })
        }
      } else {
        newValues.VER = 0
        data = yield call(commonService.post, '/sysModelItem/create', newValues)
      }
      if (data.data) {
        message.success(data.data.info)
        yield put({
          type: 'toogleModal',
          payload: { selectedRows: data.data.dataList }
        })
        yield put({ type: 'query' })
      }
    },
    *del(
      {
        payload: { record }
      },
      { call, put }
    ) {
      const tableName = 'usc_model_item'
      let { data } = yield call(commonService.post, '/sysModelItem/delete', {
        tableName,
        data: [record]
      })
      //查询数据
      if (data) {
        message.success('操作成功!')
        yield put({ type: 'query', payload: {} })
      }
    },
    *recovery(
      {
        payload: { record }
      },
      { call, put }
    ) {
      const tableName = 'usc_model_item'
      let { data } = yield call(commonService.post, '/sysModelItem/recovery', {
        tableName: tableName,
        data: [record]
      })
      //查询数据
      if (data.flag) {
        message.success('恢复成功!')
        yield put({ type: 'query', payload: {} })
      } else {
        notification.error({
          message: '操作失败!',
          duration: 0
        })
      }
    },
    *queryItem(
      {
        payload: { PID, activeKey }
      },
      { call, put, select }
    ) {
      // 切换行时清除子项选中的数据
      const clearData = activeKey ? true : false
      if (!activeKey) {
        activeKey = yield select(state => state.tableConfig.activeKey)
      }
      const { tableName, listName, namespace } = processActiviKey(activeKey, 1)
      if (clearData) {
        yield put({
          type: `${namespace}/packet`,
          payload: {
            selectedRowKey: [],
            selectedRows: []
          }
        })
      }
      let { data } = yield call(commonService.get, '/ModelItemRelationInfo/selectByCondition', {
        tableName: tableName,
        condition: `itemid='${PID}'`
      })
      let payload = {}
      payload[listName] = data.dataList
      yield put({ type: 'packet', payload })
    },
    *addOrEditItem(
      {
        payload: { values, PID, record, activeKey }
      },
      { call, put, select }
    ) {
      let data = {}
      if (!activeKey) activeKey = yield select(state => state.tableConfig.activeKey)
      const { tableName, namespace } = processActiviKey(activeKey, 1)
      const userName = localStorage.getItem('userName')
      let newValues = { userName, tableName }
      if (!record.ID) {
        // 新建
        newValues = { ...newValues, PID, fk: 'itemid', data: values }
        data = yield call(commonService.post, '/ModelItemRelationInfo/createData', newValues)
      } else {
        // 编辑
        const isUpdate = compareUpdate(values, record)
        if (isUpdate) {
          newValues.data = record
          newValues.uData = values
          data = yield call(commonService.post, '/ModelItemRelationInfo/update', newValues)
        } else {
          message.success('没有改变数据')
          if (PID) {
            yield put({
              type: `${namespace}/toogleModal`,
              payload: { visible: false }
            })
          }
        }
      }
      if (data.data.flag) {
        message.success(data.data.info)
        if (PID) {
          yield put({
            type: `${namespace}/toogleModal`,
            payload: { visible: false, selectedRows: data.data.dataList }
          })
          yield put({ type: 'queryItem', payload: { PID } })
        }
      } else {
        notification.error({
          message: data.data.info,
          duration: 0
        })
      }
    },
    *delItem(
      {
        payload: { ID, PID, STATE, activeKey }
      },
      { call, put, select }
    ) {
      if (!activeKey) activeKey = yield select(state => state.tableConfig.activeKey)
      const { tableName, namespace } = processActiviKey(activeKey, 1)
      const { listName } = processActiviKey(activeKey, 0)
      const userName = localStorage.getItem('userName')
      const dataList = { ID, PID, DUSER: userName }
      let { data } = yield call(commonService.post, '/ModelItemRelationInfo/delete', {
        tableName,
        data: [dataList],
        state: STATE
      })
      if (data.flag) {
        message.success(data.info)
        yield put({
          type: 'queryItem',
          payload: { PID }
        })
        const payload = {}
        payload[listName] = []
        yield put({ type: 'packet', payload })
        yield put({
          type: `${namespace}/packet`,
          payload: { selectedRows: [], selectedRowKey: [] }
        })
      } else {
        notification.error({
          message: data.info,
          duration: 0
        })
      }
    },
    *queryRootItem(
      {
        payload: { PID, activeKey }
      },
      { call, put, select }
    ) {
      if (!activeKey) activeKey = yield select(state => state.tableConfig.activeKey)
      const { tableName, listName } = processActiviKey(activeKey, 0)
      let { data } = yield call(commonService.get, '/ModelItemRelationInfo/selectByCondition', {
        tableName: tableName,
        condition: `rootid='${PID}'`
      })
      const payload = {}
      payload[listName] = data.dataList
      yield put({ type: 'packet', payload })
    },
    *addOrEditRootItem(
      {
        payload: { values, PID, record }
      },
      { call, put, select }
    ) {
      let data = {}
      const userName = localStorage.getItem('userName')
      const activeKey = yield select(state => state.tableConfig.activeKey)
      const { tableName, namespace } = processActiviKey(activeKey, 0)
      let newValues = { userName, tableName }
      if (!record || !record.ID) {
        // 新建
        newValues = { ...newValues, PID, fk: 'rootid', data: values }
        data = yield call(commonService.post, '/ModelItemRelationInfo/createData', newValues)
      } else {
        // 编辑
        const isUpdate = compareUpdate(values, record)
        if (isUpdate) {
          newValues.data = record
          newValues.uData = values
          data = yield call(commonService.post, '/ModelItemRelationInfo/update', newValues)
        } else {
          message.success('没有改变数据')
          if (record) {
            yield put({ type: `${namespace}/toogleItem`, payload: { itemVisible: false } })
          }
        }
      }
      if (data.data) {
        message.success(data.data.info)
        yield put({
          type: `${namespace}/packet`,
          payload: { itemVisible: false, selectedRows2: data.data.dataList }
        })
        yield put({ type: 'queryRootItem', payload: { PID } })
      }
    },
    *delRootItem(
      {
        payload: { ID, STATE, PID }
      },
      { call, put, select }
    ) {
      const activeKey = yield select(state => state.tableConfig.activeKey)
      const { tableName, namespace } = processActiviKey(activeKey, 0)
      const userName = localStorage.getItem('userName')
      const dataList = { ID, duser: userName }
      let { data } = yield call(commonService.post, '/ModelItemRelationInfo/delete', {
        tableName,
        data: [dataList],
        state: STATE
      })
      if (data) {
        message.success(data.info)
        yield put({ type: 'queryRootItem', payload: { PID } })
        yield put({
          type: `${namespace}/packet`,
          payload: { selectedRows2: [], selectedRowKey2: [] }
        })
      }
    }
  }
}
