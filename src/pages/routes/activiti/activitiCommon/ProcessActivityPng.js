/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import ProcessActivityPngCmp from '../../../components/activiti/activitiCommon/ProcessActivityPngCmp'

const ProcessActivityPng = ({ dispatch, processActivityPng }) => {
  let { processInstanceId = '', visible } = processActivityPng

  //关闭模态框
  const onCancel = () => {
    dispatch({
      type: 'processActivityPng/onCancel'
    })
  }
  let props = {
    visible,
    onCancel,
    processInstanceId
  }

  return <ProcessActivityPngCmp {...props} />
}

function mapStateToProps({ processActivityPng }) {
  return { processActivityPng }
}

export default connect(mapStateToProps)(ProcessActivityPng)
