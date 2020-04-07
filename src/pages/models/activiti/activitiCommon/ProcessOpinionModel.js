import * as commonService from '../../../service/commonService'
import { message } from 'antd'
/**
 * @author lwp
 * 流程意见提交（同意，驳回）
 */

export default {
  namespace: 'processOpinion',
  state: {
    visible: false
  },
  reducers: {
    show(
      state,
      {
        payload: { processInstanceId, title, url, refreshUrl }
      }
    ) {
      state.visible = !state.visible
      return { ...state, processInstanceId, title, url, refreshUrl }
    },
    onCancel(state) {
      let visible = !state.visible
      return { ...state, visible }
    }
  },
  effects: {
    *submit(
      {
        payload: { values }
      },
      { call, put }
    ) {
      let { data } = yield call(commonService.post, `${values.url}`, values)
      if (data.flag) {
        message.success(data.info)
        yield put({
          type: 'onCancel'
        })
        //刷新
        yield put({
          type: `${values.refreshUrl}`
        })
      } else {
        message.error(data.info)
      }
    }
  },
  subscriptions: {}
}
