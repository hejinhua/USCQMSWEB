const modelMenus = [
  { NAME: '配置平台', ICON: 'setting', NO: 'configPlatform', ID: 'config', PID: '1' },
  { NAME: '业务对象', ICON: 'project', NO: 'tableConfig', ID: 'tableConfig', PID: 'config' },
  { NAME: '导航菜单', ICON: 'bars', NO: 'nav', ID: 'nav', PID: 'config' },
  { NAME: '关联关系', ICON: 'api', NO: 'relationship', ID: 'relationship', PID: 'config' },
  { NAME: '查询视图', ICON: 'file-search', NO: 'queryView', ID: 'queryView', PID: 'config' },
  { NAME: '自动分类视图', ICON: 'read', NO: 'autoClass', ID: 'autoClass', PID: 'config' },
  { NAME: '全局表格', ICON: 'table', NO: 'globalTable', ID: 'globalTable', PID: 'config' }
]

export default {
  namespace: 'menu',
  state: {
    defaultSelectedTopMenuKey: '',
    theme: localStorage.getItem('theme') === 'true' ? true : false,
    mode: localStorage.getItem('mode') === 'true' ? true : false,
    collapsed: localStorage.getItem('collapsed') === 'true' ? true : false
  },
  //同步
  reducers: {
    packet(state, { payload }) {
      return { ...state, ...payload }
    },
    changeStyle(state, { payload: type }) {
      state[type] = !state[type]
      localStorage.setItem(type, state[type])
      return { ...state }
    }
  },
  //异步
  effects: {
    *query({}, { put }) {
      let menuData = JSON.parse(localStorage.getItem('menuData'))
      const userName = localStorage.getItem('userName')
      if (userName === 'admin' || userName === 'hjh' || userName === 'wy' || userName === 'lwp') {
        menuData = modelMenus.concat(menuData)
      }
      yield put({ type: 'packet', payload: { menuData } })
    }
  },
  //监听
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        dispatch({ type: 'query' })
      })
    }
  }
}
