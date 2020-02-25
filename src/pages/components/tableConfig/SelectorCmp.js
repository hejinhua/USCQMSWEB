/**
 * @Author: lwp
 * @Date: 2019-10-09
 */
import React, { Component } from 'react'
import { Form, message, Input } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const conditionLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
}
class SelectorCmp extends Component {
  state = {}

  Ok = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.props.Action({ values })
      } else {
        return message.error('保存失败')
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { editparams } = this.props
    let sql = ''
    let params = {}
    if (editparams && JSON.parse(editparams)) {
      params = JSON.parse(editparams)
      sql = params.sql
    }
    return (
      <Form onSubmit={this.Ok}>
        <table width='600'>
          <tbody>
            <tr>
              <th colSpan='2'>
                <FormItem label='过滤条件' {...conditionLayout} style={{ marginBottom: 0 }}>
                  {getFieldDecorator('sql', {
                    initialValue: sql
                  })(<TextArea />)}
                </FormItem>
              </th>
            </tr>
          </tbody>
        </table>
      </Form>
    )
  }
}

export default Form.create()(SelectorCmp)
