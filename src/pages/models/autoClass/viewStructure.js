import * as commonService from '../../service/commonService'
import { message, notification } from 'antd'
import { compareUpdate } from '../../../utils/utils'
export default {
  namespace: 'viewStructure',
  state: {
    visible: false,
    record: null,
    selectedRows: [],
    selectedRowKeys: []
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    },
    toogleModal(state, { payload }) {
      const visible = !state.visible
      return { ...state, ...payload, visible }
    }
  },
  effects: {
    *query({ payload }, { call, put }) {
      const { PID } = payload
      const tableName = 'usc_model_classview_node'
      let { data } = yield call(commonService.get, '/ModelItemRelationInfo/selectByCondition', {
        tableName,
        condition: `itemId='${PID}'`
      })
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.dataList }
        })
      }
    },
    *addOrEdit(
      {
        payload: { values, record, PID }
      },
      { call, put }
    ) {
      let data = {}
      const tableName = 'usc_model_classview_node'
      let newValues = { tableName }
      if (!record) {
        // 新建
        newValues = {
          ...newValues,
          fk: 'PID',
          data: values
        }
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
        }
      }
      if (data.data.flag) {
        message.success(data.data.info)
        yield put({
          type: 'query',
          payload: { PID }
        })
      } else {
        notification.error({
          message: data.data.info,
          duration: 0
        })
      }
    },
    *del(
      {
        payload: { ID, PID, STATE }
      },
      { call, put }
    ) {
      const tableName = 'usc_model_classview_node'
      const dataList = { ID, PID }
      let { data } = yield call(commonService.post, '/ModelItemRelationInfo/delete', {
        tableName,
        data: [dataList],
        STATE
      })
      if (data.flag) {
        message.success(data.info)
        yield put({
          type: 'query',
          payload: { PID }
        })
      } else {
        notification.error({
          message: data.info,
          duration: 0
        })
      }
    }
  }
}
