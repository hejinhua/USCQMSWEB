/**
 * @Author: lwp
 * @Date: 2019-12-24
 */
import React, { Component } from 'react'
import { Form, message, Input, Radio, Select } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
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
const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
}
class SelectorUserCmp extends Component {
  state = {
    selectMap: 0
  }

  componentDidMount() {
    const { editparams } = this.props
    if (editparams && JSON.parse(editparams)) {
      let { selectMap } = JSON.parse(editparams)
      console.log(selectMap)
      this.setState({ selectMap })
    }
  }

  Ok = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.props.Action({ values })
      } else {
        return message.error('保存失败')
      }
    })
  }

  onSelectMapChange = e => {
    const { value } = e.target
    this.setState({ selectMap: value })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { editparams, fieldList } = this.props
    let sql = ''
    let selectMap = this.state.selectMap
    let tfield = ''
    let params = {}
    if (editparams && JSON.parse(editparams)) {
      params = JSON.parse(editparams)
      sql = params.sql
      tfield = params.tfield
    }
    return (
      <div style={{ width: '100%' }}>
        <Form onSubmit={this.Ok}>
          <div style={{ width: '100%' }}>
            <FormItem label='过滤条件' {...conditionLayout} style={{ marginBottom: 0 }}>
              {getFieldDecorator('sql', {
                initialValue: sql
              })(<TextArea />)}
            </FormItem>
          </div>
          <div style={{ width: '94%' }}>
            <FormItem label='是否映射部门' {...formItemLayout2} style={{ marginBottom: 0 }}>
              {getFieldDecorator('selectMap', {
                rules: [{ required: true, message: '此项必填!' }],
                initialValue: selectMap || 0
              })(
                <Radio.Group onChange={this.onSelectMapChange}>
                  <Radio value={0}>不映射</Radio>
                  <Radio value={1}>映射</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </div>
          {selectMap === 1 ? (
            <FormItem label='目标字段' {...formItemLayout2} style={{ marginBottom: 0 }}>
              {getFieldDecorator('tfield', {
                rules: [{ required: true, message: '此项必填!' }],
                initialValue: tfield || ''
              })(
                <Select>
                  {fieldList.map(item => (
                    <Option value={item.NO} key={item.ID}>
                      {item.NAME}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          ) : (
            ''
          )}
        </Form>
      </div>
    )
  }
}

export default Form.create()(SelectorUserCmp)
