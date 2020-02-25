/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import ActProcessCmp from '../../../components/activiti/processManage/ActProcessCmp'

const ActProcess = ({ dispatch, actProcess }) => {
  let { visible, procdefId, itemNoList = [], list = [], grid = [], menu = [], property = [], selectedRows } = actProcess

  //流程图modal的关闭
  function onCancel() {
    dispatch({ type: 'actProcess/onCancel' })
  }
  //鼠标移入查询数据
  const onMouseEnter = () => {
    dispatch({ type: 'actProcess/getItemNoList' })
  }
  //切换选择项触发
  const handleChange = value => {
    dispatch({ type: 'actProcess/getObiList', payload: { itemNo: value.key } })
  }
  //获取选中的数据并启动流程
  const onOk = () => {
    console.log(selectedRows)
  }
  let props = {
    visible,
    onCancel,
    procdefId,
    onMouseEnter,
    itemNoList,
    handleChange,
    list,
    grid,
    menu,
    property,
    onOk
  }

  return <ActProcessCmp {...props} />
}

function mapStateToProps({ actProcess }) {
  return { actProcess }
}

export default connect(mapStateToProps)(ActProcess)
