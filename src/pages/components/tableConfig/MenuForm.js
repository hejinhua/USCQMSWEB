/*
 * @Author: hjh
 * @Date: 2019-06-18 15:30:38
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-18 16:04:03
 */

import React, { Component } from 'react'
import { Form, Input, message, Select, Checkbox } from 'antd'
import { connect } from 'dva'
import Modal from '../common/Modal'
import IconSelectorForm from '../common/IconSelectorForm'

import { reqParamMap, wtypeMap } from '../../../utils/paramsConfig'

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

class TableSortForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        const { REQPARAM } = values
        if (REQPARAM) {
          values.REQPARAM = REQPARAM.join(';')
        }
        await this.props.dispatch({ type: 'selectMenu/addOrEdit', payload: { values, record: this.props.record } })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }

  setIconName = name => {
    this.props.form.setFieldsValue({ ICON: name })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { NO, NAME, ID, IMPLCLASS, WEBPATH, ICON, WTYPE, MTYPE, REQPARAM, TITLE } = this.props.record
    if (REQPARAM) {
      REQPARAM = REQPARAM.split(';')
    }
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='100%'>
            <tbody>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('ID', {
                      initialValue: ID
                    })(<Input hidden />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单标识'>
                    {getFieldDecorator('NO', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: NO
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单名称'>
                    {getFieldDecorator('NAME', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: NAME
                    })(<Input />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                {/* <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='请求路径'>
                    {getFieldDecorator('WEBPATH', {
                      initialValue: WEBPATH
                    })(<Input />)}
                  </FormItem>
                </th> */}
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='弹窗类型'>
                    {getFieldDecorator('WTYPE', {
                      initialValue: WTYPE
                    })(
                      <Select style={{ width: '100%' }}>
                        {wtypeMap.map((item, index) => (
                          <Option value={item.value} key={index}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='菜单类型'>
                    {getFieldDecorator('MTYPE', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: MTYPE
                    })(
                      <Select style={{ width: '100%' }}>
                        <Option value={1}>业务菜单</Option>
                        <Option value={2}>系统菜单</Option>
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='弹窗标题'>
                    {getFieldDecorator('TITLE', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: TITLE
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='图标'>
                    {getFieldDecorator('ICON', {
                      initialValue: ICON
                    })(<IconSelectorForm onOk={this.setIconName} icon={ICON} />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th colSpan='2'>
                  <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='实现类'>
                    {getFieldDecorator('IMPLCLASS', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: IMPLCLASS
                    })(<Input />)}
                  </FormItem>
                </th>
              </tr>
            </tbody>
          </table>
          <div style={{ width: '100%', marginTop: '10px', fontWeight: 'bold' }}>
            <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='请求参数'>
              {getFieldDecorator('REQPARAM', {
                initialValue: REQPARAM
              })(<Checkbox.Group options={reqParamMap} />)}
            </FormItem>
          </div>
        </Form>
      </div>
    )
  }
}

export default Modal(connect()(Form.create()(TableSortForm)))
