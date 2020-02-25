import * as commonService from '../../service/commonService'
import { message } from 'antd'
import { generatorModel } from '../../../utils/modelGenarator'
import Engine from '../../components/engine/Engine'

/**
 *@author lwp
 */
export default {
  namespace: 'notice',
  state: {
    dataList: [],
    popupVisible: false,
    noticeVisible: false
  },
  reducers: {
    all(
      state,
      {
        payload: { allList }
      }
    ) {
      state.dataList = allList
      return { ...state, allList }
    },
    onPopupVisibleChange(state, {}) {
      state.popupVisible = !state.popupVisible
      return { ...state }
    },
    NoticeFiled(
      state,
      {
        payload: { NoticeModelCmp }
      }
    ) {
      return { ...state, NoticeModelCmp }
    },
    handle(state, {}) {
      state.noticeVisible = !state.noticeVisible
      return { ...state }
    },
    packet(
      state,
      {
        payload: { toDoList }
      }
    ) {
      return { ...state, toDoList }
    }
  },
  effects: {
    *query({}, { call, put }) {
      const values = {
        itemNo: 'NOTICE',
        implclass: 'com.usc.app.notice.GetNoticeListByUserId',
        condition: ` AND USERID = '${localStorage.getItem('userId')}' AND STATUS = 0 `
      }
      let allList = yield call(commonService.common, values)
      if (allList.data.dataList.length > 0) {
        message.info('您有新的消息')
        // notification.info({
        //   message: '您有新的消息',
        //   duration: 3
        // })
      }
      yield put({
        type: 'all',
        payload: { allList: allList.data.dataList }
      })
    },
    *getNoticeModal(
      {
        payload: { type }
      },
      { call, put }
    ) {
      //获取建模数据
      const values = {
        itemNo: 'NOTICE',
        itemGridNo: 'default',
        itemPropertyNo: 'default',
        itemRelationPageNo: 'default',
        userName: localStorage.getItem('userName'),
        facetype: 2
      }
      let Noticefied = yield call(commonService.post, '/sysModelToWbeClient/getModelData', values)
      let engine = Noticefied.data
      const namespace = 'NoticeModalCmp'
      engine.namespace = namespace
      engine.facetype = engine.faceType
      delete engine.faceType
      const model = generatorModel(namespace)
      //判断是否已注册model
      let result = window.g_app._models.some(model => model.namespace === namespace)
      //没有注册，则注册model
      if (!result) {
        window.g_app.model(model)
      }
      //获取数据放入模型数据在
      const noticeValues = {
        itemNo: 'NOTICE',
        itemGridNo: 'default',
        page: 1,
        implclass: 'com.usc.app.query.QuerySingleItemData',
        userName: localStorage.getItem('userName'),
        condition: ` USERID = '${localStorage.getItem('userId')}' AND TYPE = '${type}' AND STATUS = 0`
      }

      let noticeList = yield call(commonService.common, noticeValues)
      yield put({
        type: `${namespace}/packet`,
        payload: { dataList: noticeList.data.dataList, selectedRowKeys: [], selectedRows: [] }
      })
      const NoticeModelCmp = Engine(engine)
      yield put({
        type: 'NoticeFiled',
        payload: {
          NoticeModelCmp: NoticeModelCmp
        }
      })
    },
    *markedRead(
      {
        payload: { data }
      },
      { call, put, select }
    ) {
      //获取选中需要标记已读的信息
      let { dataList, selectedRowKeys, selectedRows } = yield select(state => state['NoticeModalCmp'])
      //修改选中信息状态
      const values = {
        itemNo: 'NOTICE',
        implclass: 'com.usc.app.action.BatchModifyAction',
        hData: selectedRows,
        data: { STATUS: 1 }
      }
      let markedReadList = yield call(commonService.common, values)
      selectedRowKeys.forEach((item, index) => {
        dataList[item] = markedReadList.data.dataList[index]
      })

      yield put({
        type: 'NoticeModalCmp/packet',
        payload: { dataList: dataList, selectedRowKeys: [], selectedRows: [] }
      })
      if (markedReadList.data.flag) {
        //前端过滤已标记的信息
        selectedRows.forEach(j => {
          data = data.filter(i => i.ID !== j.ID)
          return data
        })
        yield put({
          type: 'all',
          payload: { allList: data }
        })
      }
    },
    *edit(
      {
        payload: { selectedRowKey, data }
      },
      { call, put }
    ) {
      const values = {
        itemNo: 'NOTICE',
        implclass: 'com.usc.app.notice.EditStatusByNoticeId',
        otherParam: { noticeId: selectedRowKey }
      }
      let result = yield call(commonService.common, values)
      if (result.data.flag) {
        data = data.filter(i => i.ID !== selectedRowKey)
        yield put({
          type: 'all',
          payload: { allList: data }
        })
      } else {
        message.error('修改状态失败')
      }
    },
    *queryAct({}, { call, put }) {
      const userName = localStorage.getItem('userName')
      //获取待办事项
      let actToDoList = yield call(commonService.post, '/task/getTaskToDo', { userName: userName })
      const newToDoList = []
      if (actToDoList.data) {
        actToDoList.data.forEach(i => {
          const toDo = {}
          toDo.id = i.id
          toDo.title = i.name
          toDo.description = i.title
          toDo.type = 'todo'
          newToDoList.push(toDo)
        })
        yield put({
          type: 'packet',
          payload: { toDoList: newToDoList }
        })
      }
    }
  }
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     history.listen(location => {
  //       switch (location.pathname) {
  //         case '/':
  //           dispatch({
  //             type: 'query',
  //             payload: {}
  //           })
  //           break
  //         default:
  //       }
  //     })
  //   }
  // }
}
