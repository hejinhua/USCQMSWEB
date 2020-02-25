import * as commonService from '../../service/commonService'

/**
 *@author lwp
 */

export default {
  namespace: 'demo',
  state: {},
  reducers: {
    relationTabs(
      state,
      {
        payload: { relationTabs }
      }
    ) {
      return { ...state, relationTabs }
    },
    selection(
      state,
      {
        payload: { selectedRowKey, selectedRows }
      }
    ) {
      return { ...state, selectedRowKey, selectedRows }
    },
    noticeList(
      state,
      {
        payload: { noticeList }
      }
    ) {
      return { ...state, noticeList }
    }
  },
  effects: {
    *markedRead(
      {
        payload: { selectedRowKey, selectedRows, noticeList }
      },
      { call, put, select }
    ) {
      //点击行后修改状态
      const values = {
        itemNo: 'NOTICE',
        implclass: 'com.usc.app.notice.EditStatusByNoticeId',
        otherParam: { noticeId: selectedRowKey }
      }
      yield call(commonService.common, values)
      //刷新左边数据信息点击那一条的状态
      selectedRows.STATUS = 1
      noticeList[selectedRowKey[0]] = selectedRows
      yield put({
        type: 'noticeList',
        payload: { noticeList: noticeList }
      })
      //刷新信息那边的总数目
      let { dataList } = yield select(state => state['notice'])
      dataList = dataList.filter(i => i.ID !== selectedRowKey)
      yield put({
        type: 'notice/all',
        payload: { dataList: dataList, selectedRowKeys: [], selectedRows: [] }
      })
    },
    *getNoticeRelationTab(
      {
        payload: { selectedRowKey, selectedRow }
      },
      { call, put }
    ) {
      const values = {
        itemNo: 'NOTICE_ITEMNO',
        // implclass: 'com.usc.app.notice.GetUnqualified',
        implclass: 'com.usc.app.notice.GetNoticeRelationTab',
        otherParam: { itemId: selectedRowKey, selectedRow }
      }
      let relationTabs = yield call(commonService.common, values)
      yield put({
        type: 'relationTabs',
        payload: {
          relationTabs: relationTabs.data.dataList[0]
        }
      })
    },
    *queryToDo(
      {
        payload: { id }
      },
      { call, put }
    ) {
      const values = {
        itemNo: 'NOTICE',
        implclass: 'com.usc.app.notice.GetNoticeListByNoticeId',
        condition: ` AND TYPE = 'todo' AND USERID = '${localStorage.getItem('userId')}' ORDER BY CTIME DESC`,
        otherParam: { noticeId: id }
      }
      let noticeList = yield call(commonService.common, values)
      //点击哪一条信息就锁定到哪一条
      yield put({
        type: 'selection',
        payload: {
          selectedRowKey: id
        }
      })
      yield put({
        type: 'noticeList',
        payload: {
          noticeList: noticeList.data.dataList
        }
      })
    },
    *query({}, { call, put }) {
      const values = {
        itemNo: 'NOTICE',
        implclass: 'com.usc.app.notice.GetNoticeListByNoticeId',
        condition: ` AND TYPE = 'todo' AND USERID = '${localStorage.getItem('userId')}' ORDER BY CTIME DESC`
      }
      let noticeList = yield call(commonService.common, values)
      yield put({
        type: 'noticeList',
        payload: {
          noticeList: noticeList.data.dataList
        }
      })
    }
  }
}
