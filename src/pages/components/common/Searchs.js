import React from 'react'
import { Input } from 'antd'

/**
 * lwp
 * 搜索框
 * @type {Search} 调用Searchs即可
 */
const Searchs = Input.Search

export const Search = ({ onSearch, onChange }) => {
  return (
    <Searchs
      placeholder='请输入...' //输入提示
      onSearch={onSearch}
      onChange={onChange}
      enterButton
      // style={{ minWidth: '100px', height: '34px' }}
    />
  )
}
