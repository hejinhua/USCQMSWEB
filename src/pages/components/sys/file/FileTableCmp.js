import React from 'react'
import { Table, Popconfirm, Modal } from 'antd'
import $ from 'jquery'
import { EditButton, DeleteButton, DownButton, PreviewButton } from '../../common/Buttons'
import FileFrom from './form/FileFrom'

const FileTableCmp = ({
  fileByFolderId,
  rowSelection,
  del,
  showForm,
  fileVisible,
  closeFrom,
  fileRecord,
  dataList,
  preview,
  changePicture,
  pictureVisible,
  pictureUrl,
  fileState,
  folderId
}) => {
  //给表头命名
  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      width: 160,
      fixed: 'left',
      align: 'center'
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      align: 'center'
    },
    /*{
    title: '文件类别',  //根据不同的类别，展示不同的图标和提示信息
    dataIndex: 'kind',
    align:'center'
  },*/ {
      title: '创建时间',
      dataIndex: 'ctime',
      align: 'center'
    },
    {
      title: '版本',
      dataIndex: 'version',
      align: 'center'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center'
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            {/*修改弹窗*/}
            <EditButton
              id='edit'
              onClick={() => {
                showForm(record, $('#edit').text())
              }}
            />
            <Popconfirm title='确定要删除吗?' onConfirm={() => del(record.id, $('#del').text())}>
              <DeleteButton id='delete' />
            </Popconfirm>
            <a href={`api/file/webDownload?parameter={"fileId": "${record.id}","fileName": "${record.name}"}`}>
              <DownButton id='download' />
            </a>
            <PreviewButton
              id='preview'
              onClick={() => {
                preview(record, $('#preview').text())
              }}
            />
          </div>
        )
      }
    }
  ]

  function resize(obj) {
    var ifrm = obj.contentWindow.document.body

    ifrm.style.cssText = 'margin:0px;padding:0px;overflow:hidden'

    var div = document.createElement('img')

    div.src = obj.src

    obj.height = div.height

    obj.width = div.width
  }
  const clientHeight = document.documentElement.clientHeight
  return (
    <div>
      <Table dataSource={fileByFolderId} columns={columns} rowSelection={rowSelection} />
      <Modal
        width={621}
        onCancel={closeFrom}
        destroyOnClose='true'
        footer={null}
        visible={fileVisible}
        title={'修改上传文件信息'}
        centered={true}
        mask={false}
        maskClosable={false}
      >
        <FileFrom record={fileRecord} dataList={dataList} folderId={folderId} />
      </Modal>

      <Modal
        title={'预览文件'}
        width={'80%'}
        onCancel={changePicture}
        visible={pictureVisible}
        centered={true}
        footer={null}
        mask={false}
        maskClosable={false}
      >
        {fileState == 1 ? (
          <iframe
            title='op'
            src={pictureUrl}
            frameBorder='0'
            scrolling='no'
            style={{ width: '100%', height: clientHeight - 200, border: 0 }}
            onload='resize(this)'
          ></iframe>
        ) : (
          <img style={{ width: '100%', height: clientHeight - 200 }} src={pictureUrl} />
        )}

        {/*<video width="320" height="240" controls>*/}
        {/*<source src={pictureUrl} />*/}
        {/*您的浏览器不支持 HTML5 video 标签。*/}
        {/*</video>*/}
      </Modal>
    </div>
  )
}
export default FileTableCmp
