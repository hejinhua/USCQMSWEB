import React from 'react'
import FileTableCmp from '../../../components/sys/file/FileTableCmp'
import { connect } from 'dva'
import { message } from 'antd'
import moment from 'moment/moment'
import { generatorTableKey } from '../../../../utils/utils'

const FileTable = ({ dispatch, oaFile, module }) => {
  let {
    fileByFolderId = [],
    folderId,
    fileVisible = false,
    dataList = [],
    fileRecord,
    pictureVisible,
    pictureUrl,
    fileState
  } = oaFile
  //生成key
  fileByFolderId = generatorTableKey(fileByFolderId)
  fileByFolderId.map((item) => {
    item.ctime = moment(item.ctime).format('YYYY-MM-DD')
    return null
  })
  //删除
  function del(fileId, name) {
    dispatch({
      type: 'oaFile/del',
      payload: { fileId, folderId, dataList, module, name }
    })
  }

  //点击修改，打开表单，并将哪一行的数据传过来
  function showForm(record) {
    dispatch({
      type: 'oaFile/changeModalState',
      payload: { fileRecord: record }
    })
  }

  //关闭表单模态框
  function closeFrom() {
    dispatch({
      type: 'oaFile/closeMadel'
    })
  }

  function preview(record) {
    let fileName = record.name
    let lastIndex = fileName.lastIndexOf('.')
    let suffux = fileName.substring(lastIndex)
    if (
      suffux === '.doc' ||
      suffux === '.docx' ||
      suffux === '.ppt' ||
      suffux === '.pptx' ||
      suffux === '.xlsx' ||
      suffux === '.xls' ||
      suffux === '.txt'
    ) {
      pictureUrl = `api/file/previewConvertPdf?parameter={"fileId": "${record.id}","fileName": "${fileName}"}`
      fileState = 1
    } else if (
      suffux === '.jpg' ||
      suffux === '.JPG' ||
      suffux === '.gif' ||
      suffux === '.GIF' ||
      suffux === '.png' ||
      suffux === '.PNG' ||
      suffux === '.bmp' ||
      suffux === '.BMP'
    ) {
      pictureUrl = `api/file/getPreviewUrl?parameter={"fileId": "${record.id}","fileName": "${record.name}","contentType": "image/jpeg"}`
      fileState = 2
    } else if (suffux === '.pdf') {
      pictureUrl = `api/file/getPreviewUrl?parameter={"fileId": "${record.id}","fileName": "${record.name}","contentType": "application/pdf"}`
      fileState = 1
    } /*else if (suffux === '.mp4') {
      pictureUrl = `api/file/getPreviewUrl?parameter={"fileId": "${record.id}","fileName": "${record.name}","contentType": "video/!*"}`;
      fileState = 3;
    }*/ else if (
      suffux === '.dxf'
    ) {
      pictureUrl = `api/file/getCadUrl?parameter={"fileId": "${record.id}","fileName": "${record.name}"}`
      fileState = 1
    } else {
      message.error('该格式的文件不支持预览！')
      return
    }
    changePicture(pictureUrl, fileState)
  }

  const changePicture = (pictureUrl, fileState) => {
    dispatch({
      type: 'oaFile/changePicture',
      payload: { pictureUrl, fileState }
    })
  }
  let props = {
    fileByFolderId,
    del,
    fileVisible,
    showForm,
    module,
    closeFrom,
    fileRecord,
    dataList,
    preview,
    changePicture,
    pictureVisible,
    pictureUrl,
    fileState,
    folderId
  }
  return (
    <div>
      <FileTableCmp {...props} />
    </div>
  )
}
//将model中state转为props
function mapStateToProps({ oaFile }) {
  return { oaFile }
}

export default connect(mapStateToProps)(FileTable)
