/**
 * @author lwp
 */
import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd/lib/index'
import { connect } from 'dva/index'

const FormItem = Form.Item
class ActModelForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  Ok = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //保存和更新数据
        this.props.dispatch({ type: 'actModel/create', payload: { values } })
      } else {
        return message.error('保存失败')
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form //声明验证
    const { key, name, description } = this.props.record //声明record
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
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='500'>
            <tbody>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='模型标识'>
                    {getFieldDecorator('key', {
                      rules: [{ required: true, message: '请输入模型标识!' }],
                      initialValue: key
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='模型名称'>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入模型名称!' }],
                      initialValue: name
                    })(<Input />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='模型描述'>
                    {getFieldDecorator('description', {
                      initialValue: description
                    })(<Input />)}
                  </FormItem>
                </th>
              </tr>
            </tbody>
          </table>
          <FormItem style={{ textAlign: 'right', marginTop: 0, marginBottom: 0 }}>
            <Button type='primary' htmlType='submit'>
              保存
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
//使用表单共享出去的方式
export default connect()(Form.create()(ActModelForm))
