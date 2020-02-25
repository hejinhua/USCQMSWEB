/**
 *@author lwp
 */
import React from 'react'
import NoticeCmp from '../../components/notice/NoticeCmp'
import { connect } from 'dva'

const Notice = ({ dispatch, notice, theme }) => {
  let { allList = [], toDoList = [], popupVisible, NoticeModelCmp = () => <div />, noticeVisible } = notice
  let props = { allList, toDoList, dispatch, theme, popupVisible, NoticeModelCmp, noticeVisible }
  return <NoticeCmp {...props} />
}

//将model中state转为props
function mapStateToProps({ notice }) {
  return { notice }
}

export default connect(mapStateToProps)(Notice)
