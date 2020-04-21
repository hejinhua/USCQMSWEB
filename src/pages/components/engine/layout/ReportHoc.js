/*
 * @Author: hjh
 * @Date: 2020-04-15 11:09:32
 * @Description: 报表高阶组件
 */
import React from 'react'
import { message } from 'antd'
import { reportIP } from '../../../../utils/paramsConfig'

export default engine => {
  return ({ model = {} }) => {
    const { title, url, isBddp, reportId, isDynamic, values = [], height = '100%' } = engine
    const { selectedRows = [] } = model
    let src = url || `${reportIP}/RDP-SERVER/${isBddp ? 'bddpshow/show' : 'rdppage/main'}/${reportId}`
    if (values[0]) {
      values.forEach((item, index) => {
        let { name, key } = item
        if (isDynamic) {
          if (!selectedRows[0]) {
            message.warn('没有选中数据，参数获取失败')
          } else {
            key = selectedRows[0][name]
          }
        }
        src += index ? `&${name}=${key}` : `?${name}=${key}`
      })
      console.log(src)
    }
    return <iframe width='100%' height={height} title={title} src={src} />
  }
}
