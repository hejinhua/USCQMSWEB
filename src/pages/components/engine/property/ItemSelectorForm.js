import React, { useState, useEffect } from 'react'
import Modal from '../../common/DragModal'
import { Search } from '../../common/Searchs'
import ScrollTable from '../../common/scrollTable/ScrollTable'
import { message } from 'antd'

import { setColumn } from '../../../../utils/columnUtil'
import * as commonService from '../../../service/commonService'

const ItemSelectorForm = ({ visible, onCancel, onOk, editParams }) => {
  const [keys, setKeys] = useState([])
  const [rows, setRows] = useState([])
  const [modelData, setModelData] = useState({ dataList: [], gridFieldList: [], itemName: '' })

  const selectChange = (keys, rows) => {
    setKeys(keys)
    setRows(rows)
  }

  useEffect(() => {
    if (visible) {
      let { itemNo, sql } = editParams
      commonService
        .common({ itemNo: itemNo, implclass: 'com.usc.app.action.editor.ItemSelector', condition: sql })
        .then(res => {
          if (res && res.data.flag) {
            const { dataList, gridFieldList, itemName } = res.data.dataList[0]
            setModelData({ dataList, gridFieldList, itemName })
            setKeys([])
            setRows([])
          }
        })
    } else if (!visible && editParams) {
      setModelData({ dataList: [], gridFieldList: [], itemName: '' })
    }
  }, [editParams, visible])

  const Ok = () => {
    if (rows.length > 0) {
      onOk(rows)
    } else {
      message.warning('请选择数据')
    }
  }

  const onSearch = queryWord => {
    const { itemno, sql } = editParams
    commonService
      .common({
        implclass: 'com.usc.app.query.search.SearchSingleObjectAction',
        queryWord,
        itemno,
        condition: sql,
        page: 1
      })
      .then(res => {
        if (res && res.data.flag) {
          setModelData({ ...modelData, dataList: res.data.dataList })
        }
      })
  }

  return (
    <Modal width={650} title={modelData.itemName} visible={visible} onCancel={onCancel} onOk={Ok}>
      <Search onSearch={onSearch} />
      <ScrollTable
        columns={setColumn(modelData.gridFieldList)}
        list={modelData.dataList}
        height={300}
        rowSelection={{
          type: 'radio',
          onChange: selectChange,
          selectedRowKeys: keys
        }}
      />
    </Modal>
  )
}

export default ItemSelectorForm
