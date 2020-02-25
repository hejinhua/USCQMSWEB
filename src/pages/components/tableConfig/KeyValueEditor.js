/*
 * @Author: hjh
 * @Date: 2019-06-19 17:36:59
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-20 15:36:50
 * 动态添加键值对
 */

import React, { Component } from 'react'
import { Form, Input, Button, Icon, message, Checkbox } from 'antd'

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
class KeyValueEditor extends Component {
  static defaultProps = {
    isMap: true
  }

  state = {
    valuesList: [0]
  }

  componentDidMount() {
    const { editparams } = this.props
    if (editparams && JSON.parse(editparams)) {
      let values = JSON.parse(editparams).values
      let valuesList = []
      if (values && values instanceof Array) {
        values.forEach((item, index) => {
          valuesList.push(index)
        })
        this.setState({ valuesList })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.identifier !== this.props.identifier) {
      this.props.form.resetFields()
      this.setState({
        valuesList: [0]
      })
    }
  }

  Ok = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { keys, names, colors, canInput } = values
        if (names) {
          for (let i = 0; i < values.names.length; i++) {
            if (!values.names[i]) {
              values.names.splice(i, 1)
              i--
            }
          }
        }
        let newValues = []
        names.forEach((item, index) => {
          let obj = {}
          obj.name = item
          obj.color = colors[index] || ''
          if (keys) obj.key = keys[index]
          newValues.push(obj)
        })
        this.props.Action({ values: { values: newValues, canInput } })
      } else {
        return message.error('保存失败')
      }
    })
  }

  addField = () => {
    const { valuesList } = this.state
    valuesList.push(valuesList[valuesList.length - 1] + 1)
    this.setState({
      valuesList
    })
  }

  removeField = item => {
    const { valuesList } = this.state
    valuesList.splice(valuesList.indexOf(item), 1)
    this.setState({
      valuesList
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { editparams, isMap, identifier } = this.props
    const { valuesList } = this.state
    let values = []
    let canInput = false
    if (editparams && JSON.parse(editparams)) {
      values = JSON.parse(editparams).values
      canInput = JSON.parse(editparams).canInput
    }
    return (
      <Form onSubmit={this.Ok} style={{ width: '100%' }}>
        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', fontWeight: 'bold' }}>
          {identifier === 'ValueList' && (
            <div style={{ width: '45%' }}>
              <FormItem label='可输入' {...formItemLayout} style={{ marginBottom: 0 }}>
                {getFieldDecorator('canInput', {
                  initialValue: canInput,
                  valuePropName: 'checked'
                })(<Checkbox />)}
              </FormItem>
            </div>
          )}
          {valuesList.map(item => (
            <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }} key={item}>
              <div style={{ width: isMap ? '31.5%' : '47%' }}>
                <FormItem label='显示值' {...formItemLayout} style={{ marginBottom: 0 }}>
                  {getFieldDecorator(`names[${item}]`, {
                    rules: [{ required: true, message: '此项必填!' }],
                    initialValue: values && values[item] ? values[item].name || values[item] : ''
                  })(<Input />)}
                </FormItem>
              </div>
              {isMap && (
                <div style={{ width: '31.5%' }}>
                  <FormItem label='映射值' {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator(`keys[${item}]`, {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: values && values[item] ? values[item].key : ''
                    })(<Input />)}
                  </FormItem>
                </div>
              )}
              <div style={{ width: isMap ? '31.5%' : '47%' }}>
                <FormItem label='颜色' {...formItemLayout} style={{ marginBottom: 0 }}>
                  {getFieldDecorator(`colors[${item}]`, {
                    initialValue: values && values[item] ? values[item].color : ''
                  })(<Input />)}
                </FormItem>
              </div>
              {valuesList.length > 1 && (
                <div style={{ width: '5%', display: 'flex', alignItems: 'center' }}>
                  <Icon
                    className='dynamic-delete-button'
                    type='minus-circle-o'
                    onClick={() => this.removeField(item)}
                  />
                </div>
              )}
            </div>
          ))}
          <div style={{ width: '100%' }}>
            <Button type='dashed' onClick={this.addField} style={{ marginRight: '5px' }}>
              <Icon type='plus' /> 添加
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create()(KeyValueEditor)
