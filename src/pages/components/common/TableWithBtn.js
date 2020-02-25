/*
 * @Author: hjh
 * @Date: 2019-07-29 13:57:11
 * @LastEditTime: 2019-12-11 09:23:49
 * @Descripttion: 带按钮的表格组件
 */

import React, { Fragment } from 'react'
import { Button, Select } from 'antd'
import { Search } from '../common/Searchs'
import ScrollTable from '../common/scrollTable/ScrollTable'

const { Option } = Select

const TableWithBtn = props => {
  const { onSearch, width = '100%', height = '100%', btns, ...restProps } = props
  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px', display: 'flex' }}>
        {btns &&
          btns.map((item, index) => (
            <Fragment key={index}>
              {item.btns ? (
                <Select key={index} disabled={item.disabled} defaultValue={item.name} style={{ marginRight: '5px' }}>
                  {item.btns.map((item, index) => (
                    <Option key={index} onClick={item.func} disabled={item.disabled}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Button
                  onClick={item.func}
                  style={{ marginRight: '5px' }}
                  type='primary'
                  key={item.name}
                  disabled={item.disabled}
                >
                  {item.name}
                </Button>
              )}
            </Fragment>
          ))}
        <div style={{ flexGrow: 1 }}>{onSearch && <Search onSearch={onSearch} />}</div>
      </div>
      <div style={{ width: '100%', flexGrow: '1', height: '5px' }}>
        <ScrollTable {...restProps} />
      </div>
    </div>
  )
}
export default TableWithBtn
