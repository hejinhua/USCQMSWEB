/**
 * @description 生成model   model生成器放在uitls文件夹下，放在models文件夹下会自动扫描报错
 * @param namespace-对象标识
 * @param buttons-按钮配置数据
 * @returns {*}
 * @author zxy
 */
export const generatorModel = namespace => {
  let reducers = {
    packet(state, { payload }) {
      return { ...state, ...payload }
    }
  }

  return {
    namespace,
    state: {
      panes: [], //子组件
      page: 1 // 当前页数
    },
    //同步
    reducers
  }
}
