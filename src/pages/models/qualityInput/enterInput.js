import * as commonService from '../../service/commonService'
export default {
  namespace: 'enterInput',
  state: {},
  effects: {
    *start({ payload, callback }, { call }) {
      let { data } = yield call(commonService.common, payload)
      if (data) {
        callback(data)
      }
    }
  }
}
