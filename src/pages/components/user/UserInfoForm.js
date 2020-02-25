/*
 * 修改密码表单
 * @Author: hjh
 * @Date: 2019-05-13 14:50:43
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-03 11:09:44
 */
import React, { Component } from 'react'
import { Form, Input, message, Select, InputNumber, Icon, Upload } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
}

class UserInfoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { dispatch, userInfo } = this.props
        await dispatch({ type: 'user/addOrEditUserInfo', payload: { values, userInfo } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }
  getBase64 = (img, callback) => {
    console.log(img)
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
    if (!isJPG) {
      message.error('你只能上传JPG,PNG,GIF格式的图片!')
    }
    const isLt2M = file.size / 1024 < 512
    if (!isLt2M) {
      message.error('图片最大不能超过512KB!')
    }
    return isJPG && isLt2M
  }
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      )
      message.success('上传成功！')
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {
      employeeNo,
      employeeName,
      tel,
      mail,
      sax,
      INTIME,
      idCard,
      wkSate,
      departMentName,
      departMentNo,
      userName,
      employeeRemark,
      userRemark,
      age
    } = this.props.userInfo
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className='ant-upload-text'>上传头像</div>
      </div>
    )
    const imageUrl = this.state.imageUrl
    return (
      <Form onSubmit={this.Ok} style={{ fontWeight: 'bold' }}>
        <h3>员工头像</h3>
        <div style={{ position: 'relative', width: 120, height: 120, left: 175 }}>
          <Upload
            name='avatar'
            listType='picture-card'
            showUploadList={false}
            action={`/api/src/user/uploadAvatar/${localStorage.getItem('userId')}`}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt='avatar' style={{ width: 102, height: 102 }} /> : uploadButton}
          </Upload>
        </div>
        <h3>员工信息</h3>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='工号'>
          {getFieldDecorator('employeeNo', {
            initialValue: employeeNo
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='员工名称'>
          {getFieldDecorator('employeeName', {
            initialValue: employeeName
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='联系电话'>
          {getFieldDecorator('tel', {
            initialValue: tel
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='邮箱'>
          {getFieldDecorator('mail', {
            rules: [
              {
                type: 'email',
                message: '请输入正确的邮箱格式'
              }
            ],
            initialValue: mail
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='性别'>
          {getFieldDecorator('sax', {
            initialValue: sax
          })(
            <Select>
              <Option value='1'>男</Option>
              <Option value='0'>女</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='年龄'>
          {getFieldDecorator('age', {
            initialValue: age
          })(<InputNumber style={{ width: '100%' }} min={0} max={100} />)}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='入职时间'>
          {getFieldDecorator('INTIME', {
            initialValue: INTIME
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='身份证号码'>
          {getFieldDecorator('idCard', {
            initialValue: idCard
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='工作状态'>
          {getFieldDecorator('wkSate', {
            initialValue: wkSate
          })(
            <Select>
              <Option value='ON'>在岗</Option>
              <Option value='LE'>离岗</Option>
              <Option value='TR'>出差</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='员工备注'>
          {getFieldDecorator('employeeRemark', {
            initialValue: employeeRemark
          })(<Input.TextArea />)}
        </FormItem>
        <h3>用户信息</h3>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='用户登录名'>
          {getFieldDecorator('userName', {
            initialValue: userName
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='用户备注'>
          {getFieldDecorator('userRemark', {
            initialValue: userRemark
          })(<Input.TextArea />)}
        </FormItem>
        <h3>部门</h3>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='部门代号'>
          {getFieldDecorator('departMentNo', {
            initialValue: departMentNo
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='部门名称'>
          {getFieldDecorator('departMentName', {
            initialValue: departMentName
          })(<Input disabled />)}
        </FormItem>
      </Form>
    )
  }
}

export default Modal(connect()(Form.create()(UserInfoForm)))
