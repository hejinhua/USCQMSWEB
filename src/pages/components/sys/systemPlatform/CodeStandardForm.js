/**
 * @author lwp
 */
import React, { Component } from 'react'
import { Form, Input, Button, message, Select, InputNumber } from 'antd/lib/index'
import { connect } from 'dva/index'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
class CodeStandardForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  Ok = e => {
    e.preventDefault()
    this.props.form.validateFields((err, val) => {
      if (!err) {
        //保存和更新数据
        const values = {}
        if (this.props.record.id != null) {
          //修改
          delete this.props.record.children
          values.hData = [this.props.record]
          values.implclass = 'com.usc.app.action.BatchModifyAction'
          if (!val.CODE_SEGMENT == this.props.record.CODE_SEGMENT) {
            val.maxcode = ''
          }
        } else {
          //新增
          values.implclass = 'com.usc.app.action.CreateObjAction'
        }
        let itemPropertyPageNo = 'group'
        let dataType = 0
        if (val.hasOwnProperty('PREFIX')) {
          itemPropertyPageNo = 'PREFIX'
          dataType = 1
        }
        if (val.hasOwnProperty('type')) {
          itemPropertyPageNo = 'code'
          dataType = 2
        }
        values.itemPropertyPageNo = itemPropertyPageNo
        val.dataType = dataType
        values.data = val
        this.props.dispatch({ type: 'codeStandard/create', payload: { values } })
      } else {
        return message.error('保存失败')
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form //声明验证
    const { PID, NAME, OBJECT, TYPE, CODE_SEGMENT, PREFIX, CONNECTOR, STARTCODE, ENDCODE, REMARK } = this.props.record //声明record
    const createType = this.props.createType
    const isType = i => {
      if (i === undefined && createType === 0) {
        return 'block_code'
      } else if (i === undefined && createType === 1) {
        return 'classification_code'
      } else if (i === undefined && createType === 2) {
        return 'pipeline_code'
      } else {
        return i
      }
    }
    let newList = this.props.itemList.filter(item => item.TYPE === 0 || item.TYPE === 1)
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
    const onRules = (rule, value, callback) => {
      const CODE_SEGMENT = this.props.form.getFieldValue('CODE_SEGMENT')
      const STARTCODE = this.props.form.getFieldValue('STARTCODE')
      const ENDCODE = this.props.form.getFieldValue('ENDCODE')
      if (CODE_SEGMENT === '' || CODE_SEGMENT === undefined) {
        callback('请输入编码段长！')
      }
      if (value.length > Number(CODE_SEGMENT)) {
        callback('长度不能超出定义的段长！')
      }
      if (Number(STARTCODE) > Number(ENDCODE)) {
        callback('初始码不能大于终止码！')
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
    }
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='500'>
            <tbody>
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('PID', {
                      initialValue: PID
                    })(<Input hidden />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='名称'>
                    {getFieldDecorator('NAME', {
                      rules: [{ required: true, message: '请输入名称!' }],
                      initialValue: NAME
                    })(<Input />)}
                  </FormItem>
                </td>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='所属对象'>
                    {getFieldDecorator('OBJECT', {
                      rules: [{ required: true, message: '请选择所属对象!' }],
                      initialValue: OBJECT
                    })(
                      <Select style={{ width: '100%' }}>
                        {newList.map(item => (
                          <Option value={item.itemno} key={item.id}>
                            {item.NAME}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </td>
              </tr>
              {createType === 1 ? (
                <tr>
                  <td>
                    <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='编码'>
                      {getFieldDecorator('PREFIX', {
                        rules: [{ required: true, message: '请输入编码!' }],
                        initialValue: PREFIX
                      })(<Input />)}
                    </FormItem>
                  </td>
                  <td>
                    <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='连接符'>
                      {getFieldDecorator('CONNECTOR', {
                        // rules: [{ required: true, message: '请输入连接符!' }],
                        initialValue: CONNECTOR
                      })(<Input />)}
                    </FormItem>
                  </td>
                </tr>
              ) : (
                ''
              )}
              <tr>
                <td>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='编码类型'>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '请选择编码类型!' }],
                      initialValue: isType(TYPE)
                    })(
                      <Select disabled>
                        <Option value={'block_code'} key={0}>
                          分组码
                        </Option>
                        <Option value={'classification_code'} key={1}>
                          分类码
                        </Option>
                        <Option value={'pipeline_code'} key={2}>
                          流水码
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </td>
                {createType === 2 ? (
                  <td>
                    <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='编码段长'>
                      {getFieldDecorator('CODE_SEGMENT', {
                        rules: [{ required: true, message: '请输入编码段长！' }],
                        initialValue: CODE_SEGMENT
                      })(<InputNumber min={1} style={{ width: '100%' }} />)}
                    </FormItem>
                  </td>
                ) : (
                  ''
                )}
              </tr>

              {createType === 2 ? (
                <tr>
                  <td>
                    <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='起始码'>
                      {getFieldDecorator('STARTCODE', {
                        rules: [
                          { required: true, message: '请输入起始码!' },
                          { validator: onRules },
                          { pattern: /^[0-9]*$/, message: '请输入数字!' }
                        ],
                        initialValue: STARTCODE
                      })(<Input />)}
                    </FormItem>
                  </td>
                  <td>
                    <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='终止码'>
                      {getFieldDecorator('ENDCODE', {
                        rules: [
                          { required: true, message: '请输入终止码!' },
                          { validator: onRules },
                          { pattern: /^[0-9]*$/, message: '请输入数字!' }
                        ],
                        initialValue: ENDCODE
                      })(<Input />)}
                    </FormItem>
                  </td>
                </tr>
              ) : (
                ''
              )}
              {createType === 2 ? (
                <tr>
                  <td>
                    <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='备注'>
                      {getFieldDecorator('REMARK', {
                        initialValue: REMARK
                      })(<TextArea />)}
                    </FormItem>
                  </td>
                </tr>
              ) : (
                ''
              )}
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
export default connect()(Form.create()(CodeStandardForm))
