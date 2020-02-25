/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'
import { message } from 'antd/lib/index'
import { compareUpdate } from '../../../../utils/utils'

export default {
  namespace: 'codeStandard',
  state: {
    visible: false
  },
  reducers: {
    packet(
      state,
      {
        payload: { list }
      }
    ) {
      return { ...state, list }
    },
    selectRow(
      state,
      {
        payload: { selectRow }
      }
    ) {
      return { ...state, selectRow }
    },
    itemList(
      state,
      {
        payload: { itemList }
      }
    ) {
      return { ...state, itemList }
    },
    showModal(
      state,
      {
        payload: { record, createType }
      }
    ) {
      return { ...state, record, createType, visible: true }
    },
    cancel(state) {
      let visible = !state.visible
      return { ...state, visible }
    }
  },
  effects: {
    //查询模型
    *query(
      {
        payload: { Refresh }
      },
      { call, put }
    ) {
      if (!Refresh) {
        const tableName = 'usc_model_item'
        let { data } = yield call(commonService.get, '/sysModelItem/packet', { tableName })
        if (data) {
          yield put({ type: 'itemList', payload: { itemList: data.dataList } })
        }
      }
      let List = yield call(commonService.common, {
        itemNo: 'CODESTANDARD',
        itemGridNo: 'default',
        implclass: 'com.usc.app.query.QuerySingleItemData'
        // condition,
      })
      if (List.data.flag) {
        yield put({ type: 'packet', payload: { list: List.data.dataList } })
      }
    },
    *create(
      {
        payload: { values }
      },
      { call, put }
    ) {
      const { data, hData } = values
      let isUpdate = true
      if (data && hData) {
        isUpdate = compareUpdate(data, hData)
      }
      values.file = null
      values.itemNo = 'CODESTANDARD'
      if (isUpdate) {
        let { data } = yield call(commonService.common, values)
        if (data && data.flag) {
          yield put({ type: 'query', payload: { Refresh: true } })
          yield put({ type: 'cancel' })
        }
      } else {
        message.info('没有改变数据')
        // 操作成功，执行回调函数关闭弹窗
        yield put({ type: 'cancel' })
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {})
    }
  }
}
