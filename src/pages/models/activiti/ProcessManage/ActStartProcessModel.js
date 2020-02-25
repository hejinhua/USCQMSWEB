/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'
import { message } from 'antd/lib/index'

export default {
  namespace: 'actStartProcess',
  state: {
    visible: false,
    actVisible: false
  },
  reducers: {
    packet(
      state,
      {
        payload: { data, selectedRows }
      }
    ) {
      return { ...state, ...data, selectedRows }
    },
    showModal(state) {
      return { ...state, actVisible: true }
    },
    actCancel(state) {
      return { ...state, actVisible: false }
    },
    dynamicPng(
      state,
      {
        payload: { pictureUrl }
      }
    ) {
      state.visible = !state.visible
      state.pictureUrl = pictureUrl
      return { ...state }
    },
    Cancel(state) {
      return { ...state, visible: false }
    }
  },
  effects: {
    /*打开modal显示数据*/
    *query(
      {
        payload: { selectedRows }
      },
      { call, put }
    ) {
      yield put({
        type: 'showModal'
      })
      let { data } = yield call(commonService.get, '/act/process/getProcdefProcess')
      if (data) {
        yield put({
          type: 'packet',
          payload: { data, selectedRows }
        })
      }
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
      queryParam.itemNo = selectedRows[0].USC_OBJECT
      queryParam.selectedRows = selectedRows
      //清空选中的数据
      yield put({
        type: 'actTest/cleanSelectChange'
      })
      let { data } = yield call(commonService.post, '/act/process/startProcess', queryParam)
      // const values = {
      //   itemNo: 'DATAPACK',
      //   implclass: 'com.usc.app.activiti.action.StartProcessAction',
      //   otherParam: { processId: id, dataPack: selectedRows[0] }
      // }
      // let { data } = yield call(commonService.common, values)
      if (data.result) {
        message.success('启动成功！')
        yield put({
          type: 'actCancel'
        })
        //查询刷新数据状态
        // yield put({
        //   type: 'query'
        // })
      } else {
        message.error('启动失败！')
      }
    }
  }
}
