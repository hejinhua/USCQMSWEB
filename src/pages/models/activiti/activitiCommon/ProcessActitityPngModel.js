/**
 * @author lwp
 * 数据集详情
 */

export default {
  namespace: 'processActivityPng',
  state: {
    visible: false
  },
  reducers: {
    show(
      state,
      {
        payload: { processInstanceId }
      }
    ) {
      state.visible = !state.visible
      return { ...state, processInstanceId }
    },
    onCancel(state) {
      let visible = !state.visible
      return { ...state, visible }
    }
  },
  effects: {},
  subscriptions: {}
}
