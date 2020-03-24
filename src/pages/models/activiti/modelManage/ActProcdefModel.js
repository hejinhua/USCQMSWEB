/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'
import { message } from 'antd/lib/index'
import { generatorModel } from '../../../../utils/modelGenarator'
import Engine from '../../../components/engine/Engine'

export default {
  namespace: 'actProcdef',
  state: {
    visible: false,
    pictureUrl: ''
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
    ActProcessFiled(
      state,
      {
        payload: { ACT_PROCESSMANAGE_ITEMCmp }
      }
    ) {
      return { ...state, ACT_PROCESSMANAGE_ITEMCmp }
    },
    selectChange(
      state,
      {
        payload: { selectedRowKey, selectedRows }
      }
    ) {
      return { ...state, selectedRowKey, selectedRows }
    }
  },
  effects: {
    //查询流程
    *query({}, { call, put }) {
      let { data } = yield call(commonService.get, '/act/process/getProcdefProcess')
      if (data) {
        yield put({
          type: 'packet',
          payload: { list: data.list }
        })
      }
      //获取建模数据
      const values = {
        itemNo: 'ACT_PROCESSMANAGE_ITEM',
        itemGridNo: 'default',
        itemPropertyNo: 'default',
        itemRelationPageNo: 'default',
        userName: localStorage.getItem('userName'),
        facetype: 1
      }
      let ActProcessFiled = yield call(commonService.post, '/sysModelToWbeClient/getModelData', values)
      let engine = ActProcessFiled.data
      const namespace = 'ACT_PROCESSMANAGE_ITEMCmp'
      engine.namespace = namespace
      engine.pageMenus = [
        {
          id: 'ACT_PROCESSMANAGE_ITEMCmp',
          implclass: 'com.usc.app.activiti.action.CreateProcessItem',
          name: '新建',
          reqparam: 'itemNo;itemPropertyPageNo;data;itemAData',
          wtype: 'itemPropertyPage'
        }
      ]
      engine.facetype = engine.faceType
      delete engine.faceType
      const model = generatorModel(namespace)
      //判断是否已注册model
      let result = window.g_app._models.some(model => model.namespace === namespace)
      //没有注册，则注册model
      if (!result) {
        window.g_app.model(model)
      }
      const ACT_PROCESSMANAGE_ITEMCmp = Engine(engine)
      yield put({
        type: 'ActProcessFiled',
        payload: {
          ACT_PROCESSMANAGE_ITEMCmp: ACT_PROCESSMANAGE_ITEMCmp
        }
      })
    },
    *getRelItem(
      {
        payload: { selectedRowKey }
      },
      { call, put }
    ) {
      const noticeValues = {
        itemNo: 'ACT_PROCESSMANAGE_ITEM',
        implclass: 'com.usc.app.query.QuerySingleItemData',
        itemGridNo: 'default',
        page: 1,
        userName: localStorage.getItem('userName'),
        condition: `PROCDEF_ID = '${selectedRowKey}' AND DEL = 0`
      }
      let noticeList = yield call(commonService.common, noticeValues)
      yield put({
        type: 'ACT_PROCESSMANAGE_ITEMCmp/packet',
        payload: { dataList: noticeList.data.dataList, selectedRowKeys: [], selectedRows: [] }
      })
    },
    //挂起流程
    *suspension(
      {
        payload: { id }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, `/act/process/suspension/${id}`)
      //查询数据
      yield put({
        type: 'query',
        payload: {}
      })
      // 根据结果弹出信息提示框
      if (data.result === 'success') {
        message.success('挂起成功')
      } else {
        message.error('挂起失败')
      }
    },
    //激活流程
    *activation(
      {
        payload: { id }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, `/act/process/activation/${id}`)
      //查询数据
      yield put({
        type: 'query',
        payload: {}
      })
      // 根据结果弹出信息提示框
      if (data.result === 'success') {
        message.success('激活成功')
      } else {
        message.error('激活失败')
      }
    },
    //删除模型
    *del(
      {
        payload: { deploymentId }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, `/act/process/deleteByDeploymentId/${deploymentId}`)
      //查询数据
      yield put({
        type: 'query',
        payload: {}
      })
      // 根据结果弹出信息提示框
      if (data.result === 'success') {
        message.success('删除成功')
      } else {
        message.error('删除失败')
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const index = location.pathname.indexOf('_')
        const id = location.pathname.substr(index)
        switch (location.pathname) {
          case `/act/activiti/modelManage/ActProcdef${id}`:
            dispatch({
              type: 'query',
              payload: {}
            })
            break
          default:
        }
      })
    }
  }
}
