import { generatorModel } from './modelGenarator'
import { Modal } from 'antd'

/**
 * 触发修改方法前判断数据是否有变化
 * @param {type}
 * @return: boolean
 */
export const compareUpdate = (values, record) => {
  if (record && record instanceof Array) {
    record = record[0]
  }
  for (let val in values) {
    if ((values[val] || record[val]) && values[val] !== record[val]) return true
  }
  return false
}

/**
 * 遍历生成tree树结构
 * @param dataList
 * @param id
 */
export const ergodicRoot = (dataList = [], rootId = '0', ship = 'PID', id = 'ID') => {
  //不改变原数组
  if (!dataList) return []
  dataList = JSON.parse(JSON.stringify(dataList))
  let subMenu = dataList.filter(item => item[ship] === rootId)
  if (!subMenu) {
    return
  }
  //遍历父类菜单数组
  subMenu.map(item => ergodicChild(item, dataList, ship, id))
  return subMenu
}
const ergodicChild = (item, dataList = [], ship, id = 'id') => {
  let child = dataList.filter(i => i[ship] === item[id]) //查出子菜单
  if (child.length !== 0) {
    item['children'] = child //把子菜单添加到上一级菜单
    child.map(item => ergodicChild(item, dataList, ship, id))
  }
}

//生成表格的key
//第一种方法更直观
export function generatorTableKeyByIndex(dataList = []) {
  if (!dataList) {
    return []
  }
  dataList.map((item, index) => {
    item.key = index
    item.index = index
    return item
  })
  return dataList
}
export const generatorTableKey = (dataList = []) => {
  if (!dataList) {
    return []
  }
  dataList.map((item, index) => {
    item.key = item.ID
    item.index = index
    return item
  })
  return dataList
}

// 判断model是否存在，不存在就新建一个
export const judgeModel = namespace => {
  if (namespace) {
    //1. 判断是否已注册model
    let result = window.g_app._models.some(model => model.namespace === namespace)
    if (!result) {
      //2. 没有注册，则注册model
      const model = generatorModel(namespace)
      window.g_app.model(model)
      console.log(window.g_app._models)
    }
    return result
  }
}

// 执行删除操作弹出的确认弹窗
export const showConfirm = (onOk, title = '确认删除？', okText = '确定', cancelText = '取消') => {
  Modal.confirm({
    title,
    centered: true,
    okText,
    cancelText,
    onOk: () => {
      onOk()
    }
  })
}
