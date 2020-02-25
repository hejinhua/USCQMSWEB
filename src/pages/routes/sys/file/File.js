import React from 'react'
import OaFileCmp from '../../../components/sys/file/OaFileCmp'
import { connect } from 'dva'
import moment from 'moment/moment'

const Index = ({ dispatch, oaFile, module }) => {
  let { dataList = [], folderId, Visible, Cancel, record, fileByFolderId = [] } = oaFile
  //时间转换
  //解析时间
  fileByFolderId.map((item) => {
    item.ctime = moment(item.ctime).format('YYYY-MM-DD')
    return null
  })

  //模糊查询
  function search(val) {
    dispatch({
      type: 'oaFile/search',
      payload: { val, folderId, dataList }
    })
  }

  let props = {
    dataList,
    dispatch,
    folderId,
    Visible,
    Cancel,
    record,
    fileByFolderId,
    search,
    module
  }
  return (
    <div>
      <OaFileCmp {...props} />
    </div>
  )
}
//将model中state转为props
function mapStateToProps({ oaFile }) {
  return { oaFile }
}

export default connect(mapStateToProps)(Index)
