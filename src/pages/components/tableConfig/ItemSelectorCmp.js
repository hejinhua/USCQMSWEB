/*
 * @Author: hjh
 * @Date: 2019-06-19 17:36:59
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-20 15:27:56
 */

import React, { Component } from 'react'
import { Form, Input, Select, Button, Icon, message, Checkbox } from 'antd'
import * as commonService from '../../service/commonService'
import SelectItemNo from './SelectItemNo'
import { connect } from 'dva'

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
class ItemSelectorCmp extends Component {
  state = {
    sfieldList: [],
    mapFieldList: [0],
    mapFields: []
  }

  componentDidMount() {
    const { editparams } = this.props
    if (editparams && JSON.parse(editparams)) {
      let { mapFields, itemNo } = JSON.parse(editparams)
      let mapFieldList = []
      if (mapFields && mapFields instanceof Array) {
        mapFields.forEach((item, index) => {
          mapFieldList.push(index)
        })
        this.setState({ mapFieldList, mapFields })
      }
      if (itemNo && itemNo.indexOf('$') === -1) {
        this.itemNoSelect([{ ITEMNO: itemNo }])
      }
    }
  }

  Ok = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        for (let i = 0; i < values.mapFields.length; i++) {
          if (!values.mapFields[i]) {
            values.mapFields.splice(i, 1)
            i--
          }
        }
        this.props.Action({ values })
      } else {
        return message.error('保存失败')
      }
    })
  }

  openSelectItemNo = () => {
    this.props.dispatch({
      type: 'selectItemNo/query',
      payload: { condition: 'type in (0, 1)', onSelect: this.itemNoSelect }
    })
  }

  itemNoSelect = rows => {
    let obj = {}
    const { ITEMNO } = rows[0]
    obj['itemNo'] = ITEMNO
    this.props.form.setFieldsValue(obj)
    commonService.get('/sysModelItem/queryItemFields', { itemNo: ITEMNO }).then(res => {
      this.setState({ sfieldList: res.data })
    })
  }

  addField = () => {
    const { mapFieldList } = this.state
    mapFieldList.push(mapFieldList[mapFieldList.length - 1] + 1)
    this.setState({
      mapFieldList
    })
  }

  removeField = item => {
    const { mapFieldList } = this.state
    mapFieldList.splice(mapFieldList.indexOf(item), 1)
    this.setState({
      mapFieldList
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { editparams, fieldList } = this.props
    const { sfieldList, mapFieldList } = this.state
    let { itemNo = '', sql, canInput = false } = JSON.parse(editparams || '{}')
    const mapFields = this.state.mapFields
    const { form } = this.props
    const updateSfield = (val, item) => {
      const obj = {}
      obj[`mapFields[${item}]['sfield']`] = val
      form.setFieldsValue(obj)
    }
    const updateTfield = (val, item) => {
      const obj = {}
      obj[`mapFields[${item}]['tfield']`] = val
      form.setFieldsValue(obj)
    }
    return (
      <Form onSubmit={this.Ok}>
        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', fontWeight: 'bold' }}>
          <div style={{ width: '45%' }}>
            <FormItem label='对象标识' {...formItemLayout} style={{ marginBottom: 0 }}>
              {getFieldDecorator('itemNo', {
                rules: [{ required: true, message: '此项必填!' }],
                initialValue: itemNo
              })(<Input addonAfter={<Icon type='plus' onClick={this.openSelectItemNo} />} />)}
            </FormItem>
          </div>
          <div style={{ width: '45%' }}>
            <FormItem label='可输入' {...formItemLayout} style={{ marginBottom: 0 }}>
              {getFieldDecorator('canInput', {
                initialValue: canInput,
                valuePropName: 'checked'
              })(<Checkbox />)}
            </FormItem>
          </div>
          <div style={{ width: '90%' }}>
            <FormItem label='过滤条件' {...formItemLayout2} style={{ marginBottom: 0 }}>
              {getFieldDecorator('sql', {
                initialValue: sql
              })(<Input />)}
            </FormItem>
          </div>
          {mapFieldList.map(item => (
            <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }} key={item}>
              <div style={{ width: '45%' }}>
                <FormItem label={`源字段`} {...formItemLayout} style={{ marginBottom: 0 }}>
                  {getFieldDecorator(`mapFields[${item}]['sfield']`, {
                    rules: [{ required: true, message: '此项必填!' }],
                    initialValue: mapFields && mapFields[item] ? mapFields[item].sfield : ''
                  })(
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={val => {
                        mapFields[item] = { sfield: '' }
                        mapFields[item].sfield = val
                        this.setState({ mapFields })
                      }}
                      onBlur={() => {
                        updateSfield(mapFields && mapFields[item] ? mapFields[item].sfield : '', item)
                      }}
                      onSearch={val => {
                        mapFields[item] = { sfield: '' }
                        mapFields[item].sfield = val
                        this.setState({ mapFields })
                      }}
                    >
                      {sfieldList.map(item => (
                        <Option value={item.NO} key={item.ID}>
                          {item.NAME}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
              <div style={{ width: '45%' }}>
                <FormItem label='目标字段' {...formItemLayout} style={{ marginBottom: 0 }}>
                  {getFieldDecorator(`mapFields[${item}]['tfield']`, {
                    rules: [{ required: true, message: '此项必填!' }],
                    initialValue: mapFields && mapFields[item] ? mapFields[item].tfield : ''
                  })(
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={val => {
                        mapFields[item] = { tfield: '' }
                        mapFields[item].tfield = val
                        this.setState({ mapFields })
                      }}
                      onBlur={() => {
                        updateTfield(mapFields && mapFields[item] ? mapFields[item].tfield : '', item)
                      }}
                      onSearch={val => {
                        mapFields[item] = { tfield: '' }
                        mapFields[item].tfield = val
                        this.setState({ mapFields })
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
              {mapFieldList.length > 1 && (
                <div style={{ width: '10%', display: 'flex', alignItems: 'center' }}>
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
              <Icon type='plus' /> 添加映射字段
            </Button>
          </div>
        </div>
        <SelectItemNo />
      </Form>
    )
  }
}

export default connect()(Form.create()(ItemSelectorCmp))
