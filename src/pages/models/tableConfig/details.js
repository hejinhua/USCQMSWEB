export default {
  namespace: 'details',
  state: { visible: false, record: null },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
