/**
 * 工艺文件model
 * mxy
 */
import * as commonService from '../../../service/commonService'
import { message } from 'antd'

export default {
  namespace: 'oaFile',
  state: { pictureVisible: false, pictureUrl: '' },
  reducers: {
    // fileByFolderId文件信息
    packet(
      state,
      {
        payload: { dataList, fileByFolderId }
      }
    ) {
      return { ...state, dataList, fileByFolderId }
    },
    showModal(
      state,
      {
        payload: { record }
      }
    ) {
      return { ...state, record, Visible: true }
    },
    cancel(state) {
      let Visible = !state.Visible
      return { ...state, Visible }
    },
    selectChange(
      state,
      {
        payload: { keys }
      }
    ) {
      return { ...state, folderId: keys }
    },
    //展示模态框
    changeModalState(
      state,
      {
        payload: { fileRecord }
      }
    ) {
      let fileVisible = !state.fileVisible
      return { ...state, fileVisible, fileRecord }
    },
    //关闭模态框
    closeMadel(state) {
      let fileVisible = false
      return { ...state, fileVisible }
    },
    changePicture(
      state,
      {
        payload: { pictureUrl, fileState }
      }
    ) {
      state.pictureVisible = !state.pictureVisible
      state.pictureUrl = pictureUrl
      return { ...state, fileState }
    }
  },
  effects: {
    //文件删除
    *del({ payload }, { call, put }) {
      let queryParam = { id: `${payload.fileId}` }
      let datas = []
      datas.push(queryParam)
      let test = { data: datas } //"tableName":"fs_file",
      const { data } = yield call(commonService.post, '/file/delete', test)
      let keys = payload.folderId
      //刷新
      yield put({
        type: 'findFileByFolderId',
        payload: { keys, dataList: payload.dataList }
      })
      // 根据结果弹出信息提示框
      if (data.result) {
        message.success(data.result)
      } else {
        message.error(data.ErrorCode)
      }
    },

    //根据folderId查询
    *findFileByFolderId({ payload }, { call, put }) {
      let queryParam = { folderId: `${payload.keys}` }
      let { data } = yield call(commonService.get, '/file/packet', queryParam)
      if (data) {
        yield put({
          type: 'packet',
          payload: { fileByFolderId: data.list, dataList: payload.dataList }
        })
      }
    },

    //在当前文件夹中搜索文件
    *search(
      {
        payload: { val, folderId, dataList }
      },
      { call, put }
    ) {
      let queryParam = { keyword: `${val}`, folderId: `${folderId}` }
      let { data } = yield call(commonService.get, '/file/packet', queryParam)
      if (data) {
        yield put({
          type: 'packet',
          payload: {
            fileByFolderId: data.list,
            dataList
            // fileByFolderSummary: data.summary
          }
        })
      }
    },
    //修改上传文件信息
    *addOrFileEdit(
      {
        payload: { values, dataList }
      },
      { call, put }
    ) {
      let data = []
      //更新数据
      if (values.hasOwnProperty('updateT')) {
        //新增文件夹
        delete values.updateT
        data.push(values)
        let test = { data: data } //"userName":localStorage.getItem("userName"),
        yield call(commonService.post, '/file/insert', test)
      } else {
        data.push(values)
        let test = { data: data } //"tableName":"fs_file",
        yield call(commonService.post, '/file/update', test)
      }
      //关闭modal
      yield put({
        type: 'closeMadel',
        payload: {}
      })
      //查询数据
      yield put({
        type: 'findFileByFolderId',
        payload: { keys: values.folderId, dataList }
      })
    },

    //刷新，查询
    *query({ payload }, { call, put }) {
      let queryParam = {}
      let { data } = yield call(commonService.get, '/folder/packet', queryParam)
      if (data) {
        yield put({
          type: 'packet',
          payload: {
            dataList: data.list,
            fileByFolderId: payload && payload.fileByFolderId ? payload.fileByFolderId : []
          }
        })
      }
    },
    //新建时改变弹窗状态和获取record
    *addFolder({ payload }, { call, put }) {
      let record = {}
      record.updateT = 'I'
      //2.显示modal
      yield put({
        type: 'showModal',
        payload: { record }
      })
    },
    *addOrEdit(
      {
        payload: { values, userName, folderId, fileByFolderId }
      },
      { call, put }
    ) {
      let data = []
      //更新数据
      if (values.hasOwnProperty('updateT')) {
        //新增文件夹
        if (folderId === undefined) {
          folderId = 0
        }
        delete values.updateT
        // values.gmtCreate = values.gmtCreate.format("YYYY-MM-DD HH:mm:ss");
        values.parentId = folderId
        data.push(values)
        let test = { userName: userName, data: data } //"tableName":"fs_folder",
        yield call(commonService.post, '/folder/insert', test)
      } else {
        // values.gmtCreate = values.gmtCreate.format("YYYY-MM-DD HH:mm:ss");
        values.id = folderId
        data.push(values)
        let test = { data: data } //"tableName":"fs_folder",
        yield call(commonService.post, '/folder/update', test)
      }
      //关闭modal
      yield put({
        type: 'cancel',
        payload: {}
      })
      //查询数据
      yield put({
        type: 'query',
        payload: { fileByFolderId }
      })
    },
    //删除
    *deleteFolder({ payload }, { call, put }) {
      let queryParam = { id: `${payload.folderId}` }
      let datas = []
      datas.push(queryParam)
      let test = { data: datas } //"tableName":"fs_folder",
      const { data } = yield call(commonService.post, '/folder/delete', test)
      /*  if (data.result){
        message.success(data.result)
        //查询数据
        yield put({
          type: "query",
          payload: {}
        });
      }else{
        message.warn(data.ErrorCode)
      }*/
      message.success('删除成功！')
      //查询数据
      yield put({
        type: 'query',
        payload: {}
      })
    },

    *editFolder({ payload }, { call, put }) {
      const queryParam = { id: `${payload.folderId}` }
      /*  let datas = [];
      datas.push(queryParam);
      let test ={"data":datas}; //"tableName":"fs_folder",*/
      let { data } = yield call(commonService.get, '/folder/packet', queryParam)
      console.log(data)
      if (data) {
        let record = data.list[0]
        yield put({
          type: 'showModal',
          payload: { record }
        })
      } else {
        message.warn(data.ErrorCode)
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        switch (location.pathname) {
          case '/file':
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
