export default {
  namespace: 'relation',
  state: {
    visible: false,
    record: null,
    itemVisible: false,
    itemRecord: null,
    selectedRows: [],
    selectedRows2: []
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
    toogleItem(state, { payload }) {
      const itemVisible = !state.itemVisible
      return { ...state, itemVisible, ...payload }
    }
  }
}
