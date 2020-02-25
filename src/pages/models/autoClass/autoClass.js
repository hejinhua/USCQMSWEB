import * as commonService from '../../service/commonService'
import { message, notification } from 'antd'
const tableName = 'usc_model_classview'
export default {
  namespace: 'autoClass',
  state: {
    visible: false,
    record: null,
    selectedRows: [],
    selectedRowKeys: [],
    showTab: false,
    menuList: []
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    },
    toogleModal(state, { payload }) {
      const visible = !state.visible
      return { ...state, visible, ...payload }
    }
  },
  effects: {
    *query({ payload = {} }, { call, put }) {
      const { sql } = payload
      let { data } = yield call(commonService.get, '/sysModelItem/packet', { tableName, condition: sql })
      //获取级联表单配置item选择数据集(只查询普通对象和文件对象)
      let itemList = yield call(commonService.get, '/sysModelItem/packet', {
        tableName: 'usc_model_item',
        condition: "TYPE in ('0','1')"
      })
      let itemOptions = []
      if (itemList.data) {
        itemList.data.dataList.forEach(i => {
          const { NAME, ID, ITEMNO } = i
          itemOptions.push({ NAME, ID, ITEMNO })
        })
      }
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList, itemOptions, showTab: false, selectedRowKeys: [], selectedRows: [] }
        })
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
    *addOrEdit(
      {
        payload: { values, oldValues }
      },
      { call, put }
    ) {
      //更新数据
      let data = {}
      if (values.ID) {
        let upValues = { tableName, data: [oldValues], uData: values }
        data = yield call(commonService.post, '/ModelItemRelationInfo/update', upValues)
      } else {
        let newValues = { tableName, data: [values], VER: 0 }
        data = yield call(commonService.post, '/sysItemWork/create', newValues)
      }
      //关闭modal
      yield put({ type: 'toogleModal' })
      //查询数据
      yield put({ type: 'query' })
      // 根据结果弹出信息提示框
      if (data.data.flag) {
        message.success('成功')
      } else {
        message.error('失败')
      }
    },
    *del(
      {
        payload: { record }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, '/sysModelItem/delete', {
        tableName,
        data: [record]
      })
      if (data) {
        yield put({ type: 'query' })
        message.success(data.info)
      }
    },
    *recovery(
      {
        payload: { record }
      },
      { call, put }
    ) {
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
    *getRelationMenu(
      {
        payload: { PID, activeKey }
      },
      { call, put }
    ) {
      const tableName = 'usc_model_itemmenu'
      let { data } = yield call(commonService.get, '/ModelItemRelationInfo/selectByCondition', {
        tableName: tableName,
        condition: `ITEMID='${PID}'`
      })
      yield put({
        type: 'packet',
        payload: { PID, menuList: data.dataList, activeKey }
      })
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
