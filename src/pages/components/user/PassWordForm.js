/*
 * 修改密码表单
 * @Author: hjh
 * @Date: 2019-05-13 14:50:43
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-03 11:09:44
 */
import React, { Component } from 'react'
import { Form, Input, message } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

class PassWordForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { newPassword, newPassword2, password } = values
        if (newPassword2 !== newPassword) {
          message.error('两次输入密码不一致')
        } else if (newPassword === password) {
          message.error('新密码和旧密码相同')
        } else {
          callback()
          const { dispatch } = this.props
          delete values.newPassword2
          await dispatch({ type: 'user/addOrEdit', payload: { values } })
          callback()
        }
      } else {
        return message.error('保存失败')
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='100%'>
            <tbody>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='原始密码'>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '此项必填!' }]
                    })(<Input.Password autoComplete='new-password' />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='新密码'>
                    {getFieldDecorator('newPassword', {
                      rules: [{ required: true, message: '此项必填!' }]
                    })(<Input.Password autoComplete='new-password' />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='确认密码'>
                    {getFieldDecorator('newPassword2', {
                      rules: [{ required: true, message: '此项必填!' }]
                    })(<Input.Password autoComplete='new-password' />)}
                  </FormItem>
                </th>
              </tr>
            </tbody>
          </table>
        </Form>
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(PassWordForm)))
