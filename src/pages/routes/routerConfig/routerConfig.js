import routerConfigData from './routerConfigData'
/**
 * @desc 将router配置文件转成对象数组工具
 * @date 2019-05-21
 * @returns {Array}
 * @author zxy
 */
const routerConfig = () => {
  const routerDatas = []
  routerConfigData.forEach((data) => {
    let routerData = {}
    Object.keys(data).forEach((key) => {
      routerData[key] = data[key]
    })
    routerDatas.push(routerData)
  })
  return routerDatas
}

export default routerConfig
