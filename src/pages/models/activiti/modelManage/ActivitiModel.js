/**
 * @author lwp
 */
import * as commonService from '../../../service/commonService'
import { message } from 'antd/lib/index'

export default {
  namespace: 'actModel',
  state: {
    visible: false
  },
  reducers: {
    packet(
      state,
      {
        payload: { list, val }
      }
    ) {
      return { ...state, list, val }
    },
    // process(state,{payload:{processTypes}}){
    //   return {...state,processTypes}
    // },
    showModal(
      state,
      {
        payload: { record }
      }
    ) {
      return { ...state, record, visible: true }
    },
    cancel(state) {
      let visible = !state.visible
      return { ...state, visible }
    }
  },
  effects: {
    //查询模型
    *query({}, { call, put }) {
      let { data } = yield call(commonService.get, '/act/actModel/modelist')
      if (data.flag) {
        data.dataList.forEach(i => {
          // metaInfo传回来的字符串转为json，方便获取信息中的描述
          i.metaInfo = JSON.parse(i.metaInfo)
        })
        yield put({
          type: 'packet',
          payload: { list: data.dataList }
        })
      }
    },
    // //获取流程分类
    // *getProcessTypes({payload},{call,put}){
    //   let processType = yield call(commonService.query, "/sysCode/name",{name:"processType"});
    //   if (processType.data){
    //     yield put({
    //       type: "process",
    //       payload: {processTypes:processType.data.list}
    //     });
    //   }
    // },
    *editModel({ payload: record }, { put }) {
      yield put({
        type: 'showModal',
        payload: { record }
      })
    },
    //部署模型
    *deployModel(
      {
        payload: { id }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, `/act/actModel/deploy/${id}`)
      if (data.flag) {
        message.success(data.info)
      } else {
        message.error(data.info)
      }
      yield put({
        type: 'query'
      })
    },
    //新建模型
    *create(
      {
        payload: { values }
      },
      { call, put }
    ) {
      let { data } = yield call(
        commonService.post,
        `/act/actModel/create/${values.name}/${values.key}/${values.description}`
      )
      //关闭modal
      yield put({
        type: 'cancel'
      })
      //查询数据
      yield put({
        type: 'query'
      })
      // 根据结果弹出信息提示框
      if (data.flag) {
        message.success(data.info)
      } else {
        message.error(data.info)
      }
    },
    //删除模型
    *del({ payload }, { call, put }) {
      let { data } = yield call(commonService.post, `/act/actModel/deleteById/${payload.id}`)
      //查询数据
      yield put({
        type: 'query'
      })
      // 根据结果弹出信息提示框
      if (data.flag) {
        message.success(data.info)
      } else {
        message.error(data.info)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const index = location.pathname.indexOf('_')
        const id = location.pathname.substr(index)
        switch (location.pathname) {
          case `/act/activiti/modelManage/ActModel${id}`:
            dispatch({
              type: 'query',
              payload: { page: 1, pageTotal: 10 }
            })
            break
          default:
        }
      })
    }
  }
}
