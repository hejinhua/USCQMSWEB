import React, { useState, useEffect } from 'react'
import Modal from '../../common/DragModal'
import { Search } from '../../common/Searchs'
import ScrollTable from '../../common/scrollTable/ScrollTable'
import { message } from 'antd'

import * as commonService from '../../../service/commonService'

const columns = [
  {
    title: '名称',
    dataIndex: 'NAME'
  }
]

const getParentkeys = (arr, pid) => {
  let temp = []
  const forFn = function(arr, pid) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i]
      if (item.ID === pid) {
        temp.push(item.key)
        forFn(arr, item.PID)
      }
    }
  }
  forFn(arr, pid)
  return temp
}

const UserSelectorForm = ({ visible, onCancel, onOk, editParams }) => {
  const [keys, setKeys] = useState([])
  const [rows, setRows] = useState([])
  const [dataList, setDataList] = useState([])
  const [expandKeys, setExpandKeys] = useState([])

  const selectChange = (keys, rows) => {
    if (rows[0].hasOwnProperty('PASSWORD')) {
      setKeys(keys)
      setRows(rows)
    }
  }

  useEffect(() => {
    if (visible) {
      let { sql } = editParams
      commonService
        .common({ itemNo: 'SUSER', implclass: 'com.usc.app.action.editor.SelectUserEditor', condition: sql })
        .then(res => {
          if (res && res.data.flag) {
            const len = res.data.dataList.length
            let expandKeys = []
            for (let i = 0; i < len; i++) {
              expandKeys.push(i)
            }
            setExpandKeys(expandKeys)
            setDataList(res.data.dataList)
            setKeys([])
            setRows([])
          }
        })
    } else if (!visible && editParams) {
      setDataList([])
    }
  }, [editParams, visible])

  const Ok = () => {
    if (rows.length > 0) {
      let { selectMap } = editParams
      let mapList = {}
      if (selectMap === 1) {
        mapList = dataList.filter(i => i.ID === rows[0].PID)[0]
      }
      onOk(rows, mapList)
    } else {
      message.warning('请选择用户')
    }
  }

  const onSearch = queryWord => {
    let expandKeys = []
    const list = dataList.filter(i => i.NAME.indexOf(queryWord) > -1)
    list.forEach(j => {
      expandKeys = expandKeys.concat(getParentkeys(dataList, j.id))
    })
    setExpandKeys([...new Set(expandKeys)])
  }

  const onExpandedRowsChange = expandKeys => {
    setExpandKeys(expandKeys)
  }

  return (
    <Modal width={650} title='用户选择器' visible={visible} onCancel={onCancel} onOk={Ok}>
      <Search onSearch={onSearch} />
      <ScrollTable
        columns={columns}
        list={dataList}
        height={300}
        expandedRowKeys={expandKeys}
        onExpandedRowsChange={onExpandedRowsChange}
        rowSelection={{
          type: 'radio',
          onChange: selectChange,
          selectedRowKeys: keys,
          getCheckboxProps: record => ({
            disabled: !record.hasOwnProperty('PASSWORD'),
            name: record.NAME
          })
        }}
        isTree={true}
      />
    </Modal>
  )
}

export default UserSelectorForm
