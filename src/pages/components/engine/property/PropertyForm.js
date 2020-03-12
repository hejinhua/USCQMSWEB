/*
 * @desc 子页面属性页  表单组件
 * @Author: hjh
 * @Date: 2019-06-11 10:48:40
 * @Last Modified by: hjh
 * @Last Modified time: 2019-07-18
 */
import React, { Component } from 'react'
import {
  Form,
  message,
  Input,
  Select,
  Checkbox,
  DatePicker,
  Radio,
  Icon,
  Upload,
  InputNumber,
  Slider,
  Rate
} from 'antd'
import * as commonService from '../../../service/commonService'
import { connect } from 'dva'
import { ergodicRoot } from '../../../../utils/utils'
import moment from 'moment'
import ItemSelectorForm from './ItemSelectorForm'
import UserSelectorForm from './UserSelectorForm'
import NoSelectorForm from './NoSelectorForm'
import BraftEditor from 'braft-editor'

import styles from '../engine.css'

const { TextArea } = Input
const FormItem = Form.Item
const { Option, OptGroup } = Select
const { CheckboxGroup } = Checkbox
const regexMap = {
  INT: /^-?\d+$/,
  FLOAT: /^[+|-]?d*.?d*$/
}

let formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

let formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
}
const itemNoAndImplclassMap = {
  DBValueList: { itemNo: 'code', implclass: 'com.usc.app.action.editor.DBList' },
  UsersSelector: { itemNo: 'SUSER', implclass: 'com.usc.app.action.editor.SelectUserEditor' },
  DeptSelector: { itemNo: 'SDEPARTMENT', implclass: 'com.usc.app.action.editor.SelectDeptEditor' }
}
const excludeControl = [
  'undo',
  'redo',
  'separator',
  'font-size',
  'line-height',
  'letter-spacing',
  'separator',
  'text-color',
  'bold',
  'italic',
  'underline',
  'strike-through',
  'separator',
  'superscript',
  'subscript',
  'remove-styles',
  'emoji',
  'separator',
  'text-indent',
  'text-align',
  'separator',
  'headings',
  'list-ul',
  'list-ol',
  'blockquote',
  'code',
  'separator',
  'link',
  'separator',
  'hr',
  'separator',
  'media',
  'separator',
  'clear'
]

const getDeptToUserOptions = list =>
  list.map(item => {
    if (item.children) {
      return (
        <OptGroup
          key={item.id}
          label={
            <span>
              <Icon type='home' style={{ marginRight: 5 }} />
              <span>{item.name}</span>
            </span>
          }
        >
          {getDeptToUserOptions(item.children)}
        </OptGroup>
      )
    } else {
      return item.hasOwnProperty('password') ? (
        <Option
          key={item.id}
          value={item.name.substr(0, item.name.indexOf('<'))}
          label={item.name.substr(0, item.name.indexOf('<'))}
        >
          <span>
            <Icon type='user' style={{ marginRight: 5 }} />
            <span>{item.name}</span>
          </span>
        </Option>
      ) : (
        //OptGroup下没数据不展示
        <OptGroup
          key={item.id}
          label={
            <span>
              <Icon type='home' style={{ marginRight: 5 }} />
              <span>{item.name}</span>
            </span>
          }
        />
      )
    }
  })

class PropertyForm extends Component {
  static defaultProps = {
    showBtn: true
  }
  state = {
    itemVisible: false,
    userVisible: false,
    onVisible: false,
    userList: [],
    DBList: [],
    sdepartmentList: []
  }

  componentDidMount() {
    const { pageFieldList } = this.props
    pageFieldList.forEach((item, index) => {
      const { editor, editParams } = item
      if (editParams) {
        const { sql } = JSON.parse(item.editParams)
        if (editor === 'DBValueList' || editor === 'UsersSelector' || editor === 'DeptSelector') {
          const { itemNo, implclass } = itemNoAndImplclassMap[editor]
          this.getSelectList(itemNo, implclass, sql, `list${index}`)
        }
      }
      if (editor === 'ItemNoSelector') {
        commonService
          .get('/sysModelItem/packet', { tableName: 'usc_model_item', condition: `TYPE in ('0','1')` })
          .then(res => {
            if (res.data) {
              this.setState({ itemNoList: res.data.dataList })
            }
          })
      }
    })
  }

  Ok = (e, callback) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { pageFieldList, onOk, record } = this.props
        if (onOk && typeof onOk === 'function') {
          onOk(values, record)
        } else {
          let file = null
          // engine.pRecord = model.pRecord
          pageFieldList.forEach(item => {
            Object.keys(values).forEach(val => {
              if (val === item.no && values[val]) {
                const { editor } = item
                if (editor === 'DateTime') {
                  values[val] = values[val].format(JSON.parse(item.editParams).format)
                } else if (editor === 'FileSelector') {
                  file = this[`${val}File`]
                } else if (editor === 'UsersSelector') {
                  if (values[val].length > 0) {
                    values[val] = values[val].join(',')
                  }
                } else if (editor === 'RichText') {
                  values[val] = !values[val].isEmpty() ? values[val].toHTML() : null
                }
              }
            })
          })
          callback({ data: values, file })
        }
      } else {
        return message.error('保存失败')
      }
    })
  }

  toogleItem = () => {
    this.setState({
      itemVisible: !this.state.itemVisible
    })
  }

  toogleUser = () => {
    this.setState({
      userVisible: !this.state.userVisible
    })
  }

  toogleOn = () => {
    this.setState({
      onVisible: !this.state.onVisible
    })
  }

  showItemSelector = item => () => {
    const { form, showBtn } = this.props
    if (!showBtn || !item.editAble) return
    if (item.editParams) {
      const values = JSON.parse(item.editParams)
      let { itemNo, mapFields } = values
      if (itemNo && itemNo.indexOf('$') !== -1) {
        const len = itemNo.length
        const FieldsValueName = itemNo.slice(2, len - 1)
        values.itemNo = form.getFieldValue(FieldsValueName)
        if (!values.itemNo) {
          const { pageFieldList } = this.props
          const val = pageFieldList.filter(item => item.NO === FieldsValueName)[0]
          message.error(`请先输入${val.NAME}`)
          return
        }
      }
      this.toogleItem()
      this.setState({ editParams: values })
      this.mapFields = mapFields
    } else {
      message.error('引用对象参数未定义')
    }
  }

  showUserSelector = item => () => {
    const { showBtn } = this.props
    if (!showBtn || !item.editAble) return
    if (item.editParams !== null || '') {
      const values = JSON.parse(item.editParams)
      this.toogleUser()
      this.setState({ editParams: values })
      this.itemno = item.no
    }
  }

  getSelectList = (itemNo, implclass, condition, listName) => {
    commonService.common({ itemNo, implclass, condition }).then(res => {
      if (res.data) {
        this.setState({ [listName]: res.data.dataList })
      }
    })
  }

  //编码生成器
  showOnSelector = item => () => {
    const { showBtn, itemNo } = this.props
    if (!showBtn) return
    // let { itemNo } = engine
    if (item.editParams !== null || '') {
      const values = JSON.parse(item.editParams)
      values.itemNo = itemNo
      this.toogleOn()
      this.itemno = item.no
      this.setState({ editParams: values })
    }
  }

  clearFile = no => () => {
    const { showBtn } = this.props
    if (!showBtn) return
    this[`${no}File`] = null
    this.props.form.resetFields([`${no}`])
  }

  beforeUpload = (no, file) => {
    let obj = {}
    obj[no] = file.name
    this[`${no}File`] = file
    this.props.form.setFieldsValue(obj)
  }
  tipFormatter = value => `${value}%`

  onSelectInput = (val, no) => {
    let obj = {}
    obj[no] = val
    this.props.form.setFieldsValue(obj)
  }
  getEditorCmp = (item, index) => {
    const selectList = this.state[`list${index}`] || []
    const { getFieldDecorator } = this.props.form
    let { record = null, showBtn, mapRecord = null } = this.props
    let { editor, editParams, allowNull, no, editAble, fType, accuracy, defaultV, name, fLength } = item
    const params = editParams ? JSON.parse(editParams) : editParams
    let initVal = defaultV
    if (mapRecord instanceof Object && Object.keys(mapRecord).length > 0) {
      initVal = mapRecord[no]
    } else if (record && record.length > 0 && record instanceof Array) {
      initVal = record[0][no]
      record.forEach((item, index) => {
        if (index < record.length - 1) {
          if (item[no] !== record[index + 1][no]) {
            initVal = null
          }
        }
      })
    } else if (record && record instanceof Object && Object.keys(record).length > 0) {
      initVal = record[no]
    }
    let cmp = null
    let config = {
      rules: [{ required: !allowNull, message: `${name}必填!` }],
      initialValue: initVal
    }
    const disabled = !showBtn || !editAble
    if (fType === 'VARCHAR' || fType === 'LONGTEXT') {
      config.rules.push({ max: fLength, message: `字段最大长度：${fLength}` })
    }
    if (fType === 'DOUBLE' || fType === 'INT' || fType === 'FLOAT') {
      const pattern = fType === 'DOUBLE' ? new RegExp('^[0-9]+(.[0-9]{' + accuracy + '})?$') : regexMap[fType]
      config.rules.push({ pattern: pattern, message: `${name}输入格式不对` })
    }
    if (editor === 'TextBox') {
      if (fType === 'INT' || fType === 'FLOAT' || fType === 'DOUBLE' || fType === 'NUMERIC') {
        cmp = getFieldDecorator(no, config)(<InputNumber style={{ width: '100%' }} disabled={disabled} />)
      } else {
        cmp = getFieldDecorator(no, config)(<Input disabled={disabled} />)
      }
    } else if (editor === 'TextArea') {
      cmp = getFieldDecorator(no, config)(<TextArea rows={params ? params.rowHeight : 2} disabled={disabled} />)
    } else if (editor === 'RichText') {
      disabled
        ? (cmp = (
            <BraftEditor
              value={BraftEditor.createEditorState(initVal)}
              excludeControls={excludeControl}
              contentStyle={{ height: 200 }}
              style={{ border: 1, borderStyle: 'solid', borderColor: '#d9d9d9' }}
              disabled={disabled}
            />
          ))
        : (cmp = getFieldDecorator(no, {
            rules: [{ required: !allowNull, message: `${name}必填!` }],
            initialValue: BraftEditor.createEditorState(initVal)
          })(
            <BraftEditor
              contentStyle={{ height: 200 }}
              maxLength={20000}
              style={{ border: 1, borderStyle: 'solid', borderColor: '#d9d9d9' }}
            />
          ))
    } else if (editor === 'DateTime') {
      cmp = getFieldDecorator(no, { ...config, initialValue: initVal && moment(initVal) })(
        <DatePicker format={params.format} style={{ width: '100%' }} disabled={disabled} placeholder='' />
      )
    } else if (editor === 'ValueList') {
      const { canInput, values = [] } = params
      cmp = getFieldDecorator(no, config)(
        <Select
          showSearch={canInput}
          disabled={disabled}
          onSearch={val => {
            this.onSelectInput(val, no)
          }}
          onBlur={val => {
            this.onSelectInput(val, no)
          }}
        >
          {values.map(item => (
            <Option value={item.name || item} key={item.name || item}>
              {item.name || item}
            </Option>
          ))}
        </Select>
      )
    } else if (editor === 'ItemNoSelector') {
      cmp = getFieldDecorator(no, config)(
        <Select
          showSearch
          disabled={disabled}
          onSearch={val => {
            this.onSelectInput(val, no)
          }}
          onBlur={val => {
            this.onSelectInput(val, no)
          }}
          optionFilterProp='children'
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {(this.state.itemNoList || []).map(item => (
            <Option value={item.ITEMNO} key={item.ITEMNO}>
              {item.NAME}
            </Option>
          ))}
        </Select>
      )
    } else if (editor === 'MapValueList') {
      if (config.initialValue) {
        let val = params.values.filter(item => item.name === config.initialValue)
        if (val && val[0]) config.initialValue = val[0].key
      }
      cmp = getFieldDecorator(no, config)(
        <Select disabled={disabled}>
          {params.values.map(item => (
            <Option value={item.key} key={item.name}>
              {item.name}
            </Option>
          ))}
        </Select>
      )
    } else if (editor === 'DBValueList') {
      cmp = getFieldDecorator(no, config)(
        <Select
          showSearch={params.canInput}
          disabled={disabled}
          onSearch={val => {
            this.onSelectInput(val, no)
          }}
          onBlur={val => {
            this.onSelectInput(val, no)
          }}
        >
          {selectList.map((item, index) => (
            <Option key={index} value={item.ITEMNO}>
              {item.NAME}
            </Option>
          ))}
        </Select>
      )
    } else if (editor === 'RadioEditor') {
      cmp = getFieldDecorator(no, config)(
        <Radio.Group>
          {params
            ? params.values.map(item => (
                <Radio value={item.name || item} key={item.name || item} disabled={disabled}>
                  {item.name || item}
                </Radio>
              ))
            : ''}
        </Radio.Group>
      )
    } else if (editor === 'CheckEditor') {
      let options = params.values
      if (params.values instanceof Object) {
        options = params.values.map(item => item.name)
      }
      cmp = getFieldDecorator(no, config)(<CheckboxGroup options={options} disabled={disabled} />)
    } else if (editor === 'ItemSelector') {
      cmp = getFieldDecorator(no, config)(
        <Input
          disabled={disabled || !params.canInput}
          addonAfter={<Icon style={{ margin: '0' }} type='plus' onClick={this.showItemSelector(item)} />}
        />
      )
    } else if (editor === 'UserSelector') {
      cmp = getFieldDecorator(no, config)(
        <Input
          disabled
          addonAfter={<Icon style={{ margin: '0' }} type='plus' onClick={this.showUserSelector(item)} />}
        />
      )
    } else if (editor === 'UsersSelector') {
      cmp = getFieldDecorator(no, {
        rules: [{ required: !allowNull, message: `${name}必填!` }],
        initialValue: initVal === '' || initVal === undefined || initVal === null ? undefined : initVal.split(',')
      })(
        <Select disabled={disabled} mode='tags' tokenSeparators={[',']} optionLabelProp='label'>
          {getDeptToUserOptions(ergodicRoot(this.state.userList))}
        </Select>
      )
    } else if (editor === 'DeptSelector') {
      cmp = getFieldDecorator(no, config)(
        <Select disabled={disabled}>
          {selectList.map((item, index) => (
            <Option key={index} value={item.NAME} disabled={item.PID === '0'}>
              {item.NAME}
            </Option>
          ))}
        </Select>
      )
    } else if (editor === 'CheckBox') {
      if (!config.initialValue) {
        config.initialValue = false
      }
      cmp = getFieldDecorator(no, { ...config, valuePropName: 'checked' })(<Checkbox disabled={disabled} />)
    } else if (editor === 'FileSelector') {
      const props = {
        beforeUpload: file => {
          this.beforeUpload(no, file)
          return false
        }
      }
      cmp = getFieldDecorator(no, config)(
        <Input
          disabled
          addonAfter={
            this[`${no}File`] ? (
              <Icon type='close' disabled={disabled} onClick={this.clearFile(no)} />
            ) : (
              <Upload disabled={disabled} showUploadList={false} {...props}>
                <Icon type='upload' />
              </Upload>
            )
          }
        />
      )
    } else if (editor === 'OnSelector') {
      cmp = getFieldDecorator(no, config)(
        <Input disabled addonAfter={<Icon style={{ margin: '0' }} type='plus' onClick={this.showOnSelector(item)} />} />
      )
    } else if (editor === 'Password') {
      cmp = getFieldDecorator(no, config)(<Input.Password disabled={disabled} autoComplete='new-password' />)
    } else if (editor === 'Slider') {
      cmp = getFieldDecorator(no, {
        rules: [{ required: !allowNull, message: `${name}必填!` }],
        initialValue: Number(initVal)
      })(<Slider disabled={disabled} tipFormatter={this.tipFormatter} />)
    } else if (editor === 'Rate') {
      cmp = getFieldDecorator(no, config)(<Rate allowHalf disabled={disabled} />)
    }
    return cmp
  }

  selectOk = rows => {
    this.mapFields.forEach(item => {
      let obj = {}
      obj[item.tfield] = rows[0][item.sfield]
      this.props.form.setFieldsValue(obj)
    })
    this.toogleItem()
  }

  selectUserOk = (rows, mapList) => {
    let obj = {}
    obj[this.itemno] = rows[0].NAME.substr(0, rows[0].NAME.indexOf('<'))
    obj[this.state.editParams.tfield] = mapList.NAME
    this.props.form.setFieldsValue(obj)
    this.toogleUser()
  }

  selectNoOk = val => {
    let obj = {}
    obj[this.itemno] = val
    this.props.form.setFieldsValue(obj)
    this.toogleOn()
  }

  getLayout = ratio => {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: (24 * 8) / ratio }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: (24 * 40) / ratio }
      }
    }
  }

  render() {
    const { pageFieldList, columns } = this.props
    const { itemVisible, userVisible, onVisible, editParams } = this.state
    let columnsWidth = '50%'
    if (columns) {
      columnsWidth = Number((1 / columns) * 100).toFixed(1) + '%'
      const ratio = (columns - 1) * 24 + 16 + 8 // 计算某行要占整行时的文字与输入框的比例
      formItemLayout2 = this.getLayout(ratio)
    }
    return (
      <div className='full_screen'>
        <Form onSubmit={this.Ok}>
          <div className={styles.flexWrap}>
            {pageFieldList &&
              pageFieldList.map(
                (item, index) =>
                  item.no && (
                    <div style={{ width: item.wline ? '100%' : columnsWidth }} key={item.id}>
                      <FormItem
                        {...(item.wline ? formItemLayout2 : formItemLayout)}
                        style={{ marginBottom: 0 }}
                        label={item.name}
                      >
                        {this.getEditorCmp(item, index)}
                      </FormItem>
                    </div>
                  )
              )}
          </div>
        </Form>
        <ItemSelectorForm
          visible={itemVisible}
          onCancel={this.toogleItem}
          onOk={this.selectOk}
          editParams={editParams}
        />
        <UserSelectorForm
          visible={userVisible}
          onCancel={this.toogleUser}
          onOk={this.selectUserOk}
          editParams={editParams}
        />
        <NoSelectorForm visible={onVisible} onCancel={this.toogleOn} onOk={this.selectNoOk} editParams={editParams} />
      </div>
    )
  }
}

export default connect()(Form.create()(PropertyForm))
