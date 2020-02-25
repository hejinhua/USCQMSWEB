/*
 * @Author: hjh
 * @Date: 2019-06-19 17:36:59
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-20 15:36:50
 * 动态添加排序字段键值对
 */

import React, { Component } from 'react'
import { Form, Select, Button, Icon, message, Switch } from 'antd'

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
class SortFieldsForm extends Component {
  state = {
    valuesList: []
  }

  componentDidMount() {
    let { sortFields } = this.props
    sortFields = JSON.parse(sortFields || '{}')
    let valuesList = []
    if (sortFields && sortFields instanceof Array) {
      sortFields.forEach((item, index) => {
        valuesList.push(index)
      })
      this.setState({ valuesList })
    }
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { sortFields } = values
        if (sortFields) {
          for (let i = 0; i < sortFields.length; i++) {
            if (!sortFields[i] || !sortFields[i].field) {
              sortFields.splice(i, 1)
              i--
            } else {
              sortFields[i].sort = sortFields[i].sort ? 'ASC' : 'DESC'
            }
          }
        }
        callback(true, JSON.stringify(sortFields))
      } else {
        return message.error('保存失败')
      }
    })
  }

  addField = () => {
    const { valuesList } = this.state
    valuesList.push(valuesList.length ? valuesList[valuesList.length - 1] + 1 : 0)
    this.setState({ valuesList })
  }

  removeField = item => {
    const { valuesList } = this.state
    valuesList.splice(valuesList.indexOf(item), 1)
    this.setState({ valuesList })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    let { sortFields, fieldList } = this.props
    const { valuesList } = this.state
    sortFields = JSON.parse(sortFields || '{}')
    return (
      <Form onSubmit={this.Ok} style={{ width: '100%' }}>
        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', fontWeight: 'bold' }}>
          {valuesList &&
            valuesList.map(item => (
              <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }} key={item}>
                <div style={{ width: '50%' }}>
                  <FormItem label='字段' {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator(`sortFields[${item}]['field']`, {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: sortFields && sortFields[item] ? sortFields[item].field : ''
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
                </div>
                <div style={{ width: '47%' }}>
                  <FormItem label='正序' {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator(`sortFields[${item}]['sort']`, {
                      initialValue: sortFields && sortFields[item] && sortFields[item].sort === 'DESC' ? false : true,
                      valuePropName: 'checked'
                    })(<Switch checkedChildren='正序' unCheckedChildren='倒序' />)}
                  </FormItem>
                </div>
                <div style={{ width: '3%', display: 'flex', alignItems: 'center' }}>
                  <Icon
                    className='dynamic-delete-button'
                    type='minus-circle-o'
                    onClick={() => this.removeField(item)}
                  />
                </div>
              </div>
            ))}
          <div style={{ width: '100%' }}>
            <Button type='dashed' onClick={this.addField} style={{ marginRight: '5px' }}>
              <Icon type='plus' /> 添加排序字段
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create()(SortFieldsForm)
