import * as commonService from '../../service/commonService'

/**
 *@author lwp
 */

export default {
  namespace: 'tabsCard',
  state: {},
  reducers: {},
  effects: {
    *NoticeTabsCardPacket(
      {
        payload: { namespace, selectedRowKey, itemNo }
      },
      { call, put }
    ) {
      const values = {
        itemNo: 'NOTICE_ITEMNO',
        implclass: 'com.usc.app.notice.GetNoticeRelationTabDataList',
        otherParam: { itemId: selectedRowKey, relItemNo: itemNo }
      }
      let { data } = yield call(commonService.common, values)
      yield put({
        type: `${namespace}/packet`,
        payload: { dataList: data.dataList, selectedRowKeys: [], selectedRows: [] }
      })
    }
  }
}
