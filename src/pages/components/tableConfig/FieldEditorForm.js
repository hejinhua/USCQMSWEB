/*
 * @Autdor: hjh
 * @Date: 2019-05-09 10:50:13
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-26 10:07:33
 */
import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Typography,
  Select,
  Checkbox,
  message,
  Upload,
  Icon,
  Slider,
  Rate
} from 'antd'
import ItemSelectorCmp from './ItemSelectorCmp'
import SelectorCmp from './SelectorCmp'
import SelectorUserCmp from './SelectorUserCmp'
import KeyValueEditor from './KeyValueEditor'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { editorMap, formatMap } from '../../../utils/paramsConfig'

const { TextArea } = Input
const { Title } = Typography
const Option = Select.Option
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

class FieldEditorForm extends Component {
  state = {
    format: 'YYYY-MM-DD HH:mm:ss' // 设置日期格式
  }

  onSelectChange = value => {
    this.setState({
      format: value
    })
  }

  childAction = params => {
    this.props.Action(params)
  }

  onOk = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.childForm) {
          this.childForm.Ok()
        } else {
          if (values && Object.keys(values).length > 0) {
            this.props.Action({ values: values })
          }
        }
      } else {
        return message.error('保存失败')
      }
    })
  }

  clearFile = () => {
    this.setState({ fileName: '' })
  }
  tipFormatter = value => {
    return `${value}%`
  }
  render() {
    const editorProps = {
      height: 50,
      initialContent: null
    }
    const { editor, editparams } = this.props
    const { getFieldDecorator } = this.props.form
    const { fieldList } = this.props.tableConfig
    let params = {}
    if (editparams) {
      params = JSON.parse(editparams)
    }
    const { rowHeight, format, sql, canInput } = params
    const props = {
      beforeUpload: file => {
        this.setState({
          fileName: file.name
        })
        return false
      }
    }

    const title = editorMap.filter(item => item.value === editor)[0]

    return (
      <Form onSubmit={this.onOk}>
        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', fontWeight: 'bold' }}>
          <Title level={4} style={{ width: '100%' }}>
            {title && title.name}
          </Title>
          {editor === 'TextBox' && (
            <div style={{ width: '50%' }}>
              <Input />
            </div>
          )}
          {editor === 'TextArea' && (
            <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ width: '50%' }}>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='行高'>
                  {getFieldDecorator('rowHeight', {
                    rules: [{ required: true, message: '此项必填!' }],
                    initialValue: rowHeight || 2
                  })(<InputNumber min={1} style={{ width: '100%' }} />)}
                </FormItem>
              </div>
            </div>
          )}
          {editor === 'RichText' && (
            <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <BraftEditor {...editorProps} />
            </div>
          )}
          {editor === 'DateTime' && (
            <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ width: '50%' }}>
                <DatePicker format={this.state.format} allowClear={false} style={{ width: '100%' }} />
              </div>
              <div style={{ width: '50%' }}>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='时间格式'>
                  {getFieldDecorator('format', {
                    rules: [{ required: true, message: '此项必填!' }],
                    initialValue: format || 'YYYY-MM-DD HH:mm:ss'
                  })(
                    <Select onChange={this.onSelectChange} style={{ width: '100%', marginRight: 5 }}>
                      {formatMap.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
            </div>
          )}
          {editor === 'CheckBox' && <Checkbox />}
          {editor === 'MapValueList' && (
            <KeyValueEditor
              wrappedComponentRef={form => (this.childForm = form)}
              identifier={editor}
              editparams={this.props.editparams}
              Action={this.childAction}
            />
          )}
          {(editor === 'ValueList' || editor === 'RadioEditor' || editor === 'CheckEditor') && (
            <KeyValueEditor
              wrappedComponentRef={form => (this.childForm = form)}
              identifier={editor}
              isMap={false}
              editparams={this.props.editparams}
              Action={this.childAction}
            />
          )}
          {editor === 'DBValueList' && (
            <Fragment>
              <div style={{ width: '100%' }}>
                <FormItem label='可输入' {...formItemLayout} style={{ marginBottom: 0 }}>
                  {getFieldDecorator('canInput', {
                    initialValue: canInput,
                    valuePropName: 'checked'
                  })(<Checkbox />)}
                </FormItem>
              </div>
              <div style={{ width: '100%' }}>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='自定义SQL'>
                  {getFieldDecorator('sql', {
                    rules: [{ required: true, message: '此项必填!' }],
                    initialValue: sql || ''
                  })(<TextArea />)}
                </FormItem>
              </div>
            </Fragment>
          )}
          {editor === 'ItemSelector' && (
            <ItemSelectorCmp
              wrappedComponentRef={form => (this.childForm = form)}
              editparams={this.props.editparams}
              fieldList={fieldList}
              Action={this.childAction}
            />
          )}
          {editor === 'FileSelector' && (
            <div style={{ width: '50%' }}>
              <Input
                value={this.state.fileName}
                disabled
                addonAfter={
                  this.state.fileName ? (
                    <Icon type='close' onClick={this.clearFile} />
                  ) : (
                    <Upload showUploadList={false} {...props}>
                      <Icon type='upload' />
                    </Upload>
                  )
                }
              />
            </div>
          )}
          {editor === 'Password' && (
            <div style={{ width: '50%' }}>
              <Input.Password />
            </div>
          )}
          {editor === 'UserSelector' && (
            <SelectorUserCmp
              wrappedComponentRef={form => (this.childForm = form)}
              editparams={this.props.editparams}
              fieldList={fieldList}
              Action={this.childAction}
            />
          )}
          {editor === 'UsersSelector' && (
            <SelectorCmp
              wrappedComponentRef={form => (this.childForm = form)}
              editparams={this.props.editparams}
              Action={this.childAction}
            />
          )}
          {editor === 'DeptSelector' && (
            <SelectorCmp
              wrappedComponentRef={form => (this.childForm = form)}
              editparams={this.props.editparams}
              Action={this.childAction}
            />
          )}
          {editor === 'OnSelector' && (
            <SelectorCmp
              wrappedComponentRef={form => (this.childForm = form)}
              editparams={this.props.editparams}
              Action={this.childAction}
            />
          )}
          {editor === 'Slider' && (
            <Slider defaultValue={100} style={{ width: '100%' }} tipFormatter={this.tipFormatter} />
          )}
          {editor === 'Rate' && <Rate allowHalf />}
        </div>
      </Form>
    )
  }
}

function mapStateToProps({ tableConfig }) {
  return { tableConfig }
}

export default connect(mapStateToProps)(Form.create()(FieldEditorForm))
