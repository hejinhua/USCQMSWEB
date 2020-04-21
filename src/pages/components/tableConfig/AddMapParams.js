/*
 * @Author: hjh
 * @Date: 2019-06-19 17:36:59
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-20 15:27:56
 */

import React, { Component } from 'react'
import { Form, Select, Button, Icon, message, Input } from 'antd'
import * as commonService from '../../service/commonService'
import Modal from '../common/DragModal'
import SelectItemNo from './SelectItemNo'

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

class AddMapParams extends Component {
  state = {
    mapCount: [0],
    defaultVCount: [0]
  }

  componentDidUpdate(prevProps) {
    const { PROPERTYPARAM, ITEMNO, visible } = this.props
    if (visible && visible !== prevProps.visible) {
      this.queryFields(ITEMNO, 1)
      if (PROPERTYPARAM) {
        let { mapFields } = JSON.parse(PROPERTYPARAM || '{}')
        let mapCount = []
        if (mapFields && mapFields instanceof Array) {
          mapFields.forEach((item, index) => {
            mapCount.push(index)
          })
          this.setState({ mapCount })
        } else {
          mapCount = [0]
        }
      } else {
        this.setState({ mapCount: [0] })
      }
    }
  }

  editField = (name, item) => {
    const list = this.state[name]
    item || item === 0 ? list.splice(list.indexOf(item), 1) : list.push(list[list.length - 1] + 1)
    this.setState({ [name]: list })
  }

  queryFields = (itemNo, type) => {
    commonService.get('/sysModelItem/queryItemFields', { itemNo }).then(res => {
      let data = {}
      data[`${type ? 'tfieldList' : 'sfieldList'}`] = res.data
      this.setState(data)
    })
  }

  Ok = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { mapFields, itemNo } = values
        const { Action, toogleModal } = this.props
        for (let i = 0; i < mapFields.length; i++) {
          if (!mapFields[i]) {
            mapFields.splice(i, 1)
            i--
          }
        }
        Action(JSON.stringify({ mapFields, itemNo }))
        toogleModal()
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
    this.queryFields(ITEMNO, 0)
  }
  render() {
    const { form, PROPERTYPARAM, visible, toogleModal } = this.props
    const { getFieldDecorator } = form
    const { mapCount, sfieldList = [], tfieldList = [] } = this.state
    const { mapFields, itemNo } = JSON.parse(PROPERTYPARAM || '{}')
    return (
      <Modal width={700} title='映射参数' visible={visible} onOk={this.Ok} onCancel={toogleModal}>
        <Form style={{ width: '100%' }}>
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', fontWeight: 'bold' }}>
            <div style={{ width: '45%' }}>
              <FormItem label='对象标识' {...formItemLayout} style={{ marginBottom: 0 }}>
                {getFieldDecorator('itemNo', {
                  rules: [{ required: true, message: '此项必填!' }],
                  initialValue: itemNo
                })(<Input addonAfter={<Icon type='plus' onClick={this.openSelectItemNo} />} />)}
              </FormItem>
            </div>
            {mapCount.map(item => (
              <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }} key={item}>
                <div style={{ width: '47%' }}>
                  <FormItem label='源字段' {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator(`mapFields[${item}]['sfield']`, {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: mapFields && mapFields[item] ? mapFields[item].sfield : ''
                    })(
                      <Select>
                        {sfieldList.map(item => (
                          <Option value={item.NO} key={item.ID}>
                            {item.NAME}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </div>
                <div style={{ width: '47%' }}>
                  <FormItem label='目标字段' {...formItemLayout} style={{ marginBottom: 0 }}>
                    {getFieldDecorator(`mapFields[${item}]['tfield']`, {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: mapFields && mapFields[item] ? mapFields[item].tfield : ''
                    })(
                      <Select>
                        {tfieldList.map(item => (
                          <Option value={item.NO} key={item.ID}>
                            {item.NAME}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </div>
                {mapCount.length > 1 && (
                  <div style={{ width: '5%', display: 'flex', alignItems: 'center' }}>
                    <Icon
                      className='dynamic-delete-button'
                      type='minus-circle-o'
                      onClick={() => this.editField('mapCount', item)}
                    />
                  </div>
                )}
              </div>
            ))}
            <div style={{ width: '100%' }}>
              <Button type='dashed' onClick={() => this.editField('mapCount')} style={{ marginRight: '5px' }}>
                <Icon type='plus' /> 添加
              </Button>
            </div>
          </div>
        </Form>
        <SelectItemNo />
      </Modal>
    )
  }
}

export default Form.create()(AddMapParams)
