/**
 * Created by mxy on 2019/5/27.
 */
import React, { Component } from 'react'
import { Tree, Upload, Icon, message, Button, Modal } from 'antd'
import OaFileForm from './form/OaFileForm'
import FileTable from '../../../routes/sys/file/FileTable'
import $ from 'jquery'
import { Search } from '../../common/Searchs'
const DirectoryTree = Tree.DirectoryTree
const TreeNode = Tree.TreeNode

class OaFileCmp extends Component {
  //tree控件================================
  format = dataList => {
    let ret = [],
      o = {}
    function add(arr, data) {
      let ids = data.id
      let obj = {
        id: ids,
        parentId: data.parentId,
        name: data.name,
        children: []
      }
      o[ids] = obj
      arr.push(obj)
    }
    dataList.forEach(x => {
      let ids = x.parentId
      if (o[ids]) {
        add(o[ids].children, x)
      } else {
        add(ret, x)
      }
    })
    return ret
  }

  //遍历json绘制出tree结构
  mapData(children) {
    if (children && Array.isArray(children)) {
      return children.map(ele => {
        if (ele.children && Array.isArray(ele.children)) {
          return (
            <TreeNode title={ele.name} key={ele.id}>
              {this.mapData(ele.children)}
            </TreeNode>
          )
        } else {
          return <TreeNode title={ele.name} key={ele.id} />
        }
      })
    }
    return []
  }

  //点击文件夹，返回不同的folederId
  onSelect = selectedKeys => {
    let keys = selectedKeys[0]
    this.props.dispatch({ type: 'oaFile/selectChange', payload: { keys } })
    //查询文件夹下面的文件
    this.props.dispatch({ type: 'oaFile/findFileByFolderId', payload: { keys, dataList: this.props.dataList } })
  }
  addFolder = name => {
    let folderId = this.props.folderId
    /*if (!folderId || folderId.length === 0){
     return message.error('请选择父文件夹！');
     }*/
    this.props.dispatch({ type: 'oaFile/addFolder', payload: { folderId, module: this.props.module, name } })
  }
  deleteFolder = name => {
    let folderId = this.props.folderId
    if (!folderId || folderId.length === 0) {
      message.error('请选择文件夹！')
      return false
    }
    this.props.dispatch({ type: 'oaFile/deleteFolder', payload: { folderId, module: this.props.module, name } })
  }
  editFolder = name => {
    let folderId = this.props.folderId
    if (!folderId || folderId.length === 0) {
      return message.error('请选择需要修改或者查看的文件夹！')
    }
    this.props.dispatch({
      type: 'oaFile/editFolder',
      payload: { folderId, module: this.props.module, name, fileList: this.props.dataList }
    })
  }
  cancel = () => {
    this.props.dispatch({ type: 'oaFile/cancel' })
  }
  /**
   * 上传之前判断选中文件夹没有
   * @returns {boolean}
   */
  beforeUpload = () => {
    if (this.props.folderId == null) {
      message.error('请选择文件夹！')
      return false
    }
  }
  /**
   * 上传之后刷新
   */
  flush = () => {
    let keys = this.props.folderId
    this.props.dispatch({ type: 'oaFile/findFileByFolderId', payload: { keys, dataList: this.props.dataList } })
  }
  onChange = info => {
    const status = info.file.status
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.response != null && Object.keys(info.file.response).length == 1) {
      message.error(`${info.file.name} 文件名已经存在！`)
      // status == 'error' mxy暂时注释
    }
    if (status === 'done' && Object.keys(info.file.response).length != 1) {
      message.success(`${info.file.name} 文件上传成功！.`)
      this.flush()
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败！`)
    }
  }

  render() {
    let content = []
    let data = this.format(this.props.dataList)
    data.map(item => {
      let { id, name, children } = { ...item }
      if (name) {
        content.push(
          <TreeNode title={name} key={id}>
            {this.mapData(children)}
          </TreeNode>
        )
      }
    })
    /*let {id, name, children} = {...data[0]};
     if (name) {
     content.push(<TreeNode title={name} key={id}>{this.mapData(children)}</TreeNode>)
     }*/
    const headers = {
      module: encodeURI(this.props.module),
      name: encodeURI('上传'),
      userId: localStorage.getItem('id'),
      sessionId: localStorage.getItem('sessionId')
    }
    //上传文件参数用formData来上传数据
    let folderId = this.props.folderId
    /*let param = {
      "rTableName": "fs_r_folder_file",
      "tableName": "fs_file",
      "data": [{
        "pitem": "fs_folder",
        "pid": `${folderId}`
      }],
    };*/
    let param = {
      userName: `${localStorage.getItem('userName')}`,
      data: [
        {
          folderId: `${folderId}`
        }
      ]
    }
    let parameters = `${JSON.stringify(param)}`
    parameters = encodeURIComponent(parameters)
    return (
      <div>
        <Button
          id='add'
          style={{ marginLeft: 5, background: '#3ca2e0', color: 'white' }}
          onClick={() => this.addFolder($('#add').text())}
        >
          <Icon type='folder-add' />
          新建文件夹
        </Button>
        {/* <Popconfirm title="文件夹确定删除吗?删除文件夹之后所在下面的文件及其子文件夹也将会被全部删除！" onConfirm={() => this.deleteFolder($("#del").text())}>
          <Button id='del' style={{marginLeft: 5, background: "#31B0D5", color: "white"}}><Icon type="delete"/>删除文件夹</Button>
        </Popconfirm>
*/}
        <Button
          id='edit'
          style={{ marginLeft: 5, background: '#D53E3A', color: 'white' }}
          onClick={() => this.editFolder($('#edit').text())}
        >
          <Icon type='edit' />
          修改/查看文件夹
        </Button>
        <Search onSearch={this.props.search} />
        <Upload
          class='ant-upload ant-upload-select ant-upload-select-text'
          name='file'
          action={`api/file/webUpload/${parameters}`}
          onChange={this.onChange}
          beforeUpload={this.beforeUpload}
          headers={headers}
          showUploadList={false}
        >
          <Button style={{ marginLeft: 5, background: '#3ca2e0', color: 'white' }}>
            <Icon type='arrow-up' />
            上传
          </Button>
        </Upload>

        <hr width='100%' size='10px' color='blue' />
        <div
          style={{ width: '20%', minHeight: '100vh', borderColor: 'blue', backgroundColor: '#DBDFF0', float: 'left' }}
        >
          <DirectoryTree onSelect={this.onSelect}>{content}</DirectoryTree>
        </div>
        <Modal
          width={631}
          title='文件夹信息'
          visible={this.props.Visible}
          onCancel={this.cancel}
          destroyOnClose='true'
          footer={null}
          centered={true}
          mask={false}
          maskClosable={false}
        >
          <OaFileForm record={this.props.record} folderId={folderId} fileByFolderId={this.props.fileByFolderId} />
        </Modal>
        <div style={{ float: 'left', width: '5%', height: '100px' }} />
        <div style={{ width: '70%', float: 'left' }}>
          <FileTable fileByFolderId={this.props.fileByFolderId} folderId={folderId} module={this.props.module} />
        </div>
      </div>
    )
  }
}

export default OaFileCmp
