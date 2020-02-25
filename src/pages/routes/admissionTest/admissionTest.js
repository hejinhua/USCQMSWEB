/**
 *@author lwp
 */
import React from 'react'
import AdmissionTestCmp from '../../components/admissionTest/admissionTestCmp'
import { connect } from 'dva'

const AdmissionTest = ({ dispatch, admissionTest }) => {
  let { toDoList = [] } = admissionTest
  let props = { toDoList, dispatch }
  return <AdmissionTestCmp {...props} />
}
//将model中state转为props
function mapStateToProps({ admissionTest }) {
  return { admissionTest }
}

export default connect(mapStateToProps)(AdmissionTest)
