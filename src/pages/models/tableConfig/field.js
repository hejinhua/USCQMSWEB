export default {
  namespace: 'field',
  state: {
    visible: false,
    record: null,
    selectedRows: [],
    selectedRowKey: []
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    },
    toogleModal(state, { payload }) {
      const visible = !state.visible
      return { ...state, ...payload, visible }
    }
  }
}
