/**
 * @author lwp
 */
import React from 'react'
import { connect } from 'dva/index'
import ProcessOpinionCmp from '../../../components/activiti/activitiCommon/ProcessOpinionCmp'

const ProcessOpinion = ({ dispatch, processOpinion, list }) => {
  let { visible, processInstanceId = '', title = '', url = '', refreshUrl = '' } = processOpinion
  //关闭模态框
  const onCancel = () => {
    dispatch({
      type: 'processOpinion/onCancel'
    })
  }
  let props = {
    visible,
    onCancel,
    processInstanceId,
    title,
    url,
    refreshUrl,
    list
  }

  return <ProcessOpinionCmp {...props} />
}

function mapStateToProps({ processOpinion }) {
  return { processOpinion }
}

export default connect(mapStateToProps)(ProcessOpinion)
