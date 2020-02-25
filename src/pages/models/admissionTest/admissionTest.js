import * as commonService from '../../service/commonService'

/**
 *@author lwp
 */

export default {
  namespace: 'admissionTest',
  state: {},
  reducers: {
    packet(
      state,
      {
        payload: { toDoList }
      }
    ) {
      return { toDoList }
    }
  },
  effects: {
    *query({}, { call, put }) {
      // const userName = localStorage.getItem('userName')
      // //获取待办事项
      // let toDoList = yield call(commonService.post, '/task/getTaskToDo', { userName: userName })
      // const newToDoList = []
      // if (toDoList.data) {
      //   toDoList.data.forEach(i => {
      //     const toDo = {}
      //     toDo.id = i.id
      //     toDo.title = i.name
      //     toDo.description = i.title
      //     toDo.type = 'todo'
      //     newToDoList.push(toDo)
      //   })
      //   yield put({
      //     type: 'packet',
      //     payload: { toDoList: newToDoList }
      //   })
      // }
    }
  }
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     history.listen(location => {
  //       switch (location.pathname) {
  //         case '/':
  //           dispatch({
  //             type: 'query',
  //             payload: {}
  //           })
  //           break
  //         default:
  //       }
  //     })
  //   }
  // }
}
