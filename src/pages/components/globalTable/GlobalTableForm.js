import React, { Component } from 'react'
import { Form, Input, message, Select } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

const FormItem = Form.Item
const Option = Select.Option
class GlobalTableForm extends Component {
  Ok = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const oldValues = this.props.record
        this.props.dispatch({ type: 'globalTable/addOrEdit', payload: { values, oldValues } })
      } else {
        return message.error('保存失败')
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { NO, NAME, REMARK, ID, TYPE } = this.props.record
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='100%'>
            <tbody>
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='标识'>
                    {getFieldDecorator('NO', {
                      rules: [{ required: true, message: '必填项!' }],
                      initialValue: NO
                    })(<Input />)}
                  </FormItem>
                </td>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='名称'>
                    {getFieldDecorator('NAME', {
                      rules: [{ required: true, message: '必填项!' }],
                      initialValue: NAME
                    })(<Input />)}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='类型'>
                    {getFieldDecorator('TYPE', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: TYPE || 1
                    })(
                      <Select style={{ width: '100%' }}>
                        <Option value={1}>普通表格</Option>
                        <Option value={0}>树形表格</Option>
                      </Select>
                    )}
                  </FormItem>
                </td>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='备注'>
                    {getFieldDecorator('REMARK', {
                      initialValue: REMARK
                    })(<Input />)}
                  </FormItem>
                </td>
              </tr>
            </tbody>
          </table>
          <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('ID', {
              initialValue: ID
            })(<Input hidden />)}
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(GlobalTableForm)))
