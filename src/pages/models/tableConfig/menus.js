export default {
  namespace: 'menus',
  state: {
    visible: false,
    record: null
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    },
    toogleModal(state, { payload }) {
      const visible = !state.visible
      return { ...state, visible, ...payload }
    },
    toogleParams(state, { payload }) {
      const visibleParams = !state.visibleParams
      return { ...state, ...payload, visibleParams }
    }
  }
}
