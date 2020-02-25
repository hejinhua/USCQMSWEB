/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'
import { message } from 'antd/lib/index'

export default {
  namespace: 'actProcess',
  state: {
    visible: false
  },
  reducers: {
    packet(
      state,
      {
        payload: { data }
      }
    ) {
      return { ...state, ...data }
    },
    show(
      state,
      {
        payload: { procdefId }
      }
    ) {
      state.visible = !state.visible
      return { ...state, procdefId }
    },
    onCancel(state) {
      return { ...state, visible: false }
    },
    ItemNoList(
      state,
      {
        payload: { itemNoList }
      }
    ) {
      return { ...state, itemNoList }
    },
    objList(
      state,
      {
        payload: { list, grid, menu, property }
      }
    ) {
      return { ...state, list, grid, menu, property }
    },
    selectChange(
      state,
      {
        payload: { selectedRows }
      }
    ) {
      return { ...state, selectedRows }
    }
  },
  effects: {
    /*打开modal显示数据*/
    *getItemNoList({}, { call, put }) {
      let { data } = yield call(commonService.get, '/sysMenu/packet')
      yield put({
        type: 'ItemNoList',
        payload: { itemNoList: data.list }
      })
    },
    *getObiList(
      {
        payload: { itemNo }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, '/sysModelToWbeClient/getModelData', {
        modelNo: itemNo
      })
      console.log(data)
      let { grid, pageInfo, menu, property } = data
      yield put({
        type: 'objList',
        payload: { list: pageInfo.list, grid, menu, property }
      })
    },
    *startProcess(
      {
        payload: { id, selectedRows }
      },
      { call, put }
    ) {
      const queryParam = {}
      queryParam.id = id
      queryParam.userName = localStorage.getItem('userName')
      queryParam.selectedRows = selectedRows
      //清空选中的数据
      yield put({
        type: 'actTest/cleanSelectChange'
      })
      let { data } = yield call(commonService.post, '/act/process/startProcess', queryParam)
      if (data.result) {
        message.success('启动成功！')
        yield put({
          type: 'actCancel'
        })
        //查询刷新数据状态
        yield put({
          type: 'actTest/query'
        })
      } else {
        message.error('启动失败！')
      }
    }
  }
}
