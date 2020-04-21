/*
 * @Author: hjh
 * @Date: 2019-06-19 17:36:59
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-20 15:36:50
 * 报表参数
 */

import React, { Component } from 'react'
import { Form, Input, Button, Icon, message, Checkbox, Select } from 'antd'
import * as commonService from '../../service/commonService'

const FormItem = Form.Item
const Option = Select.Option

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
class ReportParams extends Component {
  state = {
    valuesList: [0]
  }

  componentDidMount() {
    const { IMPLCLASS, ITEMNO } = this.props
    commonService.get('/sysModelItem/queryItemFields', { itemNo: ITEMNO }).then(res => {
      this.setState({ fieldList: res.data })
    })
    if (IMPLCLASS) {
      let { values, isDynamic } = IMPLCLASS
      let valuesList = []
      if (values && values instanceof Array) {
        values.forEach((item, index) => {
          valuesList.push(index)
        })
        this.setState({ valuesList, isDynamic })
      }
    }
  }

  Ok = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { keys, names, isDynamic } = values
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
          if (keys) obj.key = keys[index]
          newValues.push(obj)
        })
        this.props.Action({ values: newValues, isDynamic })
      } else {
        return message.error('保存失败')
      }
    })
  }

  addField = () => {
    const { valuesList } = this.state
    valuesList.push(valuesList[valuesList.length - 1] + 1)
    this.setState({ valuesList })
  }

  removeField = item => {
    const { valuesList } = this.state
    valuesList.splice(valuesList.indexOf(item), 1)
    this.setState({ valuesList })
  }
  isDynamicChange = e => {
    this.setState({ isDynamic: e.target.checked })
  }
  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    const { IMPLCLASS } = this.props
    const { valuesList, fieldList = [] } = this.state
    let { values = [], isDynamic } = IMPLCLASS || {}
    return (
      <Form onSubmit={this.Ok} style={{ width: '100%' }}>
        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', fontWeight: 'bold' }}>
          <div style={{ width: '45%' }}>
            <FormItem label='动态参数' {...formItemLayout} style={{ marginBottom: 0 }}>
              {getFieldDecorator('isDynamic', {
                initialValue: isDynamic,
                valuePropName: 'checked'
              })(<Checkbox onChange={this.isDynamicChange} />)}
            </FormItem>
          </div>
          {valuesList.map(item => (
            <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }} key={item}>
              <div style={{ width: '47%' }}>
                <FormItem label='参数名' {...formItemLayout} style={{ marginBottom: 0 }}>
                  {getFieldDecorator(`names[${item}]`, {
                    rules: [{ required: true, message: '此项必填!' }],
                    initialValue: values[item] ? values[item].name : ''
                  })(
                    <Select
                      showSearch={!this.state.isDynamic}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onSearch={val => {
                        let { names } = form.getFieldsValue()
                        if (val) {
                          names[item] = val
                          form.setFieldsValue({ names })
                        }
                      }}
                    >
                      {fieldList.map(item => (
                        <Option value={item.NO} key={item.ID}>
                          {item.NAME}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
              {!this.state.isDynamic && (
                <div style={{ width: '47%' }}>
                  <FormItem label='值' {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator(`keys[${item}]`, {
                      initialValue: values[item] ? values[item].key : ''
                    })(<Input />)}
                  </FormItem>
                </div>
              )}
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
              <Icon type='plus' /> 添加报表参数
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create()(ReportParams)
