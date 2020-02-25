import * as commonService from '../../service/commonService'
import { message, notification } from 'antd'
import { compareUpdate } from '../../../utils/utils'
export default {
  namespace: 'user',
  state: {
    visible: false,
    infoVisible: false,
    userInfo: {},
    isModeling: localStorage.getItem('isModeling')
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
    toogleInfo(state, { payload }) {
      const infoVisible = !state.infoVisible
      return { ...state, ...payload, infoVisible }
    }
  },
  effects: {
    *query({}, { call, put }) {
      let { data } = yield call(commonService.get, '/user/getInfo')
      if (data) {
        if (data.flag) {
          yield put({ type: 'toogleInfo' })
          yield put({ type: 'packet', payload: { userInfo: data.dataList[0] } })
        } else {
          notification.error({
            message: data.info,
            duration: 0
          })
        }
      }
    },
    *addOrEdit(
      {
        payload: { values }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, '/modifiyUPS', values)
      if (data) {
        if (data.flag) {
          message.success(data.info)
          yield put({ type: 'toogleModal' })
        } else {
          notification.error({
            message: data.info,
            duration: 0
          })
        }
      }
    },
    *addOrEditUserInfo(
      {
        payload: { values, userInfo }
      },
      { call, put }
    ) {
      let isUpdate = true
      if (values && userInfo) {
        isUpdate = compareUpdate(values, userInfo)
      }
      if (isUpdate) {
        let { data } = yield call(commonService.post, '/user/modifiyInfo', values)
        if (data) {
          if (data.flag) {
            message.success(data.info)
          } else {
            yield put({ type: 'packet', payload: { userInfo } })
            notification.error({
              message: data.info,
              duration: 0
            })
          }
        }
      } else {
        message.info('没有改变数据')
      }
    },
    *synchro({}, { call, put, select }) {
      let { data } = yield call(commonService.post, '/modelSynchronous/all')
      if (data.flag) {
        message.success(data.info)
        let { panes = [] } = yield select(state => state.tab)
        for (let i = 0; i < panes.length; i++) {
          yield put({ type: `${panes[i].key}/query`, payload: {} })
        }
      }
    },
    *startModel({}, { call, put }) {
      let { data } = yield call(commonService.post, '/model/openModel')
      if (data.flag) {
        message.success(data.info)
        localStorage.setItem('isModeling', true)
        localStorage.setItem('modelUser', localStorage.getItem('userName'))
        yield put({ type: 'packet', payload: { isModeling: true } })
      } else {
        message.error(data.info)
      }
    },
    *endModel({ payload, callback }, { call, put }) {
      let { data } = yield call(commonService.post, '/model/closeModel', payload)
      if (data.flag) {
        yield put({ type: 'tableConfig/query', payload: {} })
        if (data.force) {
          callback(data)
        } else {
          message.success(data.info)
          localStorage.removeItem('isModeling')
          localStorage.removeItem('modelUser')
          yield put({ type: 'packet', payload: { isModeling: false } })
        }
      } else {
        message.error(data.info)
      }
    }
  }
}
