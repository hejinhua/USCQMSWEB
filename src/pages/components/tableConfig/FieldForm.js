/*
 * @Author: hjh
 * @Date: 2019-08-10 10:02:55
 * @LastEditTime : 2019-12-24 14:40:46
 * @Descripttion:
 */
import React, { Component } from 'react'
import { Form, Input, Checkbox, message, Select } from 'antd'
import { connect } from 'dva'
import FiledEditorForm from './FieldEditorForm'
import Modal from '../common/Modal'
import { editorMap, ftypeMap } from '../../../utils/paramsConfig'

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
const { TextArea } = Input
const FormItem = Form.Item
const Option = Select.Option

class FieldForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      EDITOR: (this.props.record && this.props.record.EDITOR) || 'TextBox'
    }
  }

  componentDidMount() {
    this.onFtypeChange(this.props.record.FTYPE)
    this.onSelectChange(this.props.record.EDITOR || 'TextBox')
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.record.FTYPE !== this.props.record.FTYPE) {
      this.onFtypeChange(nextProps.record.FTYPE)
      this.onSelectChange(this.props.record.EDITOR || 'TextBox')
    }
  }

  Ok = (e, callback) => {
    e.preventDefault()
    if (this.childForm) {
      this.childForm.onOk()
    }
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        callback()
        values.ONLY = values.ONLY ? 1 : 0
        values.ALLOWNULL = values.ALLOWNULL ? 1 : 0
        values.TYPE = values.TYPE === '业务字段' ? 1 : values.TYPE === '系统字段' ? 0 : values.TYPE
        await this.props.dispatch({
          type: 'tableConfig/addOrEditItem',
          payload: { values, PID: this.props.PID, record: this.props.record }
        })
        callback()
      } else {
        return message.error('保存失败')
      }
    })
  }

  Action = params => {
    this.props.form.setFieldsValue({ EDITPARAMS: JSON.stringify(params.values) })
  }

  onSelectChange = value => {
    this.setState({
      EDITOR: value,
      isEditparamsRequired:
        value === 'TextBox' ||
        value === 'CheckBox' ||
        value === 'FileSelector' ||
        value === 'Password' ||
        value === 'Slider' ||
        value === 'Rate' ||
        value === 'RichText'
          ? false
          : true
    })
    this.props.form.resetFields(['EDITPARAMS'])
  }

  onFtypeChange = value => {
    if (value === 'DATETIME') {
      this.props.form.setFieldsValue({ EDITOR: 'DateTime' })
      this.setState({
        EDITOR: 'DateTime'
      })
    }
    if (value === 'BOOLEAN') {
      this.props.form.setFieldsValue({ EDITOR: 'CheckBox' })
      this.props.form.setFieldsValue({ FLENGTH: 1 })
      this.setState({
        EDITOR: 'CheckBox'
      })
    }
    this.setState({
      isFlengthDisabled: value === 'BOOLEAN' || value === 'DATETIME' || value === 'LONGTEXT' ? true : false,
      isFlengthRequired: value === 'DATETIME' || value === 'LONGTEXT' ? false : true,
      isAccuracyDisabled: value === 'FLOAT' || value === 'DOUBLE' || value === 'NUMERIC' ? false : true
    })
  }

  onlyChange = e => {
    this.props.form.setFieldsValue({ ALLOWNULL: false })
    this.setState({
      isAllownullDisabled: e.target.checked ? true : false
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form //声明验证
    const {
      isFlengthDisabled,
      isAccuracyDisabled,
      isAllownullDisabled,
      isFlengthRequired,
      isEditparamsRequired
    } = this.state
    const {
      ID,
      DEL,
      NO,
      FIELDNAME,
      NAME,
      FTYPE,
      FLENGTH,
      EDITOR,
      ACCURACY,
      TYPE,
      REMARK,
      ONLY,
      ALLOWNULL,
      DEFAULTV,
      EDITPARAMS,
      STATE
    } = this.props.record //声明record

    const onRules = (rule, value, callback) => {
      let fieldList = this.props.FieldList
      if (ID) {
        fieldList = fieldList.filter(item => item.ID !== ID)
      }
      fieldList.forEach(obj => {
        for (const i of Object.values(obj)) {
          if (i === value) {
            callback('该值不能重复！')
          }
        }
      })
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
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
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('DEL', {
                      initialValue: DEL
                    })(<Input hidden />)}
                  </FormItem>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='字段标识'>
                    {getFieldDecorator('NO', {
                      rules: [
                        {
                          required: true,
                          pattern: '^[a-zA-Z][a-zA-Z0-9_]*$',
                          message: '输入不规范!'
                        },
                        {
                          validator: onRules
                        }
                      ],
                      initialValue: NO
                    })(<Input type={'text'} disabled={TYPE === '系统字段' || STATE === 'F'} />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='数据库字段名'>
                    {getFieldDecorator('FIELDNAME', {
                      rules: [
                        { required: true, pattern: '^[a-zA-Z][a-zA-Z0-9_]*$', message: '输入不规范!' },
                        {
                          validator: onRules
                        }
                      ],
                      initialValue: FIELDNAME
                    })(<Input disabled={TYPE === '系统字段' || STATE === 'F'} />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='字段名称'>
                    {getFieldDecorator('NAME', {
                      rules: [
                        { required: true, message: '此项必填!' },
                        {
                          validator: onRules
                        }
                      ],
                      initialValue: NAME
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='字段类型'>
                    {getFieldDecorator('FTYPE', {
                      initialValue: FTYPE || 'VARCHAR',
                      rules: [{ required: true, message: '此项必填!' }]
                    })(
                      <Select
                        disabled={TYPE === '系统字段' || STATE === 'F'}
                        style={{ width: '100%' }}
                        onChange={this.onFtypeChange}
                      >
                        {ftypeMap.map((item, index) => (
                          <Option value={item.type} key={index}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='字段长度'>
                    {getFieldDecorator('FLENGTH', {
                      initialValue: FLENGTH || 50,
                      rules: [{ required: isFlengthRequired, message: '此项必填!' }]
                    })(<Input disabled={isFlengthDisabled} />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='精度'>
                    {getFieldDecorator('ACCURACY', {
                      initialValue: ACCURACY
                    })(<Input disabled={isAccuracyDisabled} />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='缺省值'>
                    {getFieldDecorator('DEFAULTV', {
                      initialValue: DEFAULTV
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='编辑器'>
                    {getFieldDecorator('EDITOR', {
                      initialValue: EDITOR || 'TextBox'
                    })(
                      <Select onChange={this.onSelectChange} style={{ width: '100%' }}>
                        {editorMap.map((item, index) => (
                          <Option value={item.value} key={index}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='是否为空'>
                    {getFieldDecorator('ALLOWNULL', {
                      initialValue: ALLOWNULL || true,
                      valuePropName: 'checked'
                    })(<Checkbox disabled={isAllownullDisabled} />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='验证唯一性'>
                    {getFieldDecorator('ONLY', {
                      initialValue: ONLY,
                      valuePropName: 'checked'
                    })(<Checkbox onChange={this.onlyChange} />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='字段类别'>
                    {getFieldDecorator('TYPE', {
                      initialValue: TYPE
                    })(
                      <Select disabled style={{ width: '100%' }}>
                        <Option value={0}>系统字段</Option>
                        <Option value={1}>业务字段</Option>
                      </Select>
                    )}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='备注'>
                    {getFieldDecorator('REMARK', {
                      initialValue: REMARK
                    })(<TextArea autosize={{ minRows: 2 }} />)}
                  </FormItem>
                </th>
              </tr>
              <tr>
                <th colSpan='2'>
                  <FormItem {...formItemLayout2} style={{ marginBottom: 0 }} label='编辑器参数'>
                    {getFieldDecorator('EDITPARAMS', {
                      initialValue: EDITPARAMS,
                      rules: [{ required: isEditparamsRequired, message: '此项必填!' }]
                    })(<TextArea />)}
                  </FormItem>
                </th>
              </tr>
            </tbody>
          </table>
        </Form>
        <FiledEditorForm
          wrappedComponentRef={form => (this.childForm = form)}
          editor={this.state.EDITOR}
          editparams={EDITPARAMS}
          Action={this.Action}
        />
      </div>
    )
  }
}
//使用表单共享出去的方式
export default Modal(connect()(Form.create()(FieldForm)))