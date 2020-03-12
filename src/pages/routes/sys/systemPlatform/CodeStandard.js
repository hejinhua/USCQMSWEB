/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import CodeStandardCmp from '../../../components/sys/systemPlatform/CodeStandardCmp'
import { message } from 'antd/lib/index'

const CodeStandard = ({ dispatch, codeStandard }) => {
  let { list = [], record = {}, visible, createType = '', itemList = [], selectRow } = codeStandard

  const showModel = val => {
    if (val === 0) {
      dispatch({ type: 'codeStandard/showModal', payload: { record: { PID: '0' }, createType: val } })
    } else if (val === 1) {
      if ((selectRow && selectRow.DATATYPE === 0) || (selectRow && selectRow.DATATYPE === 1)) {
        dispatch({
          type: 'codeStandard/showModal',
          payload: { record: { object: selectRow.OBJECT, PID: selectRow.ID }, createType: val }
        })
      } else {
        message.warning('请选择组或者前缀数据！')
      }
    } else if (val === 2) {
      if ((selectRow && selectRow.DATATYPE === 1) || (selectRow && selectRow.DATATYPE === 0)) {
        dispatch({
          type: 'codeStandard/showModal',
          payload: { record: { object: selectRow.OBJECT, PID: selectRow.ID }, createType: val }
        })
      } else {
        message.warning('请选择组或者前缀数据！')
      }
    }
  }
  const editModel = () => {
    if (selectRow) {
      dispatch({ type: 'codeStandard/showModal', payload: { record: selectRow, createType: selectRow.DATATYPE } })
    } else {
      message.warning('请选择需要修改的数据!')
    }
  }
  const onCancel = () => {
    dispatch({ type: 'codeStandard/cancel' })
  }
  const onSelect = (selectedKeys, e) => {
    const { dataRef } = e.node.props
    dispatch({ type: 'codeStandard/selectRow', payload: { selectRow: dataRef } })
  }

  let props = {
    list,
    visible,
    record,
    showModel,
    editModel,
    onCancel,
    createType,
    itemList,
    onSelect,
    selectRow
  }

  return <CodeStandardCmp {...props} />
}

function mapStateToProps({ codeStandard }) {
  return { codeStandard }
}

export default connect(mapStateToProps)(CodeStandard)
