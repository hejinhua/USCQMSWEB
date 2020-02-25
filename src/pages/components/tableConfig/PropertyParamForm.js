/*
 * @Author: hjh
 * @Date: 2019-06-19 17:36:59
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-20 15:27:56
 */

import React, { Component, Fragment } from 'react'
import { Form, Select, Button, Icon, Radio, message, Checkbox, Input } from 'antd'
import * as commonService from '../../service/commonService'
import Modal from '../common/DragModal'

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

class PropertyParamForm extends Component {
  state = {
    mapCount: [0],
    defaultVCount: [0]
  }

  componentDidUpdate(prevProps) {
    const { PROPERTYPARAM, MNO, ITEMNO, visible, pItemNo } = this.props
    if (visible && visible !== prevProps.visible) {
      if (PROPERTYPARAM && JSON.parse(PROPERTYPARAM)) {
        let { mapFields, selectMap, defaultVList, selectDefaultV } = JSON.parse(PROPERTYPARAM)
        let mapCount = []
        let defaultVCount = []
        if (mapFields && mapFields instanceof Array) {
          mapFields.forEach((item, index) => {
            mapCount.push(index)
          })
          this.setState({ mapCount })
        }
        if (defaultVList && defaultVList instanceof Array) {
          defaultVList.forEach((item, index) => {
            defaultVCount.push(index)
          })
          this.setState({ mapCount, defaultVCount })
        }
        this.queryFields(ITEMNO, MNO)
        if (selectMap) this.queryFields(pItemNo)
        this.setState({ selectMap, selectDefaultV })
      } else {
        this.setState({ selectMap: false, selectDefaultV: false, mapCount: [0], defaultVCount: [0] })
      }
    }
  }

  editField = (name, item) => {
    const list = this.state[name]
    item || item === 0 ? list.splice(list.indexOf(item), 1) : list.push(list[list.length - 1] + 1)
    this.setState({ [name]: list })
  }

  onDefaultVChange = e => {
    const { checked } = e.target
    this.setState({ selectDefaultV: checked })
    if (checked) {
      const { MNO, ITEMNO } = this.props
      this.queryFields(ITEMNO, MNO)
    }
  }

  onChange = e => {
    this.queryFields(e.target.value)
    this.setState({ mapCount: [0] })
    this.props.form.resetFields()
  }

  onSelectMapChange = e => {
    const { checked } = e.target
    this.setState({ selectMap: checked })
    if (checked) {
      const { MNO, ITEMNO, pItemNo } = this.props
      this.queryFields(pItemNo)
      this.queryFields(ITEMNO, MNO)
    }
  }
  queryFields = (itemNo, propertyPageNo) => {
    commonService.get('/sysModelItem/queryItemFields', { itemNo, propertyPageNo }).then(res => {
      let data = {}
      data[`${propertyPageNo ? 'tfieldList' : 'sfieldList'}`] = res.data
      this.setState(data)
    })
  }

  Ok = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { selectMap, selectDefaultV, mapFields, defaultVList } = values
        const { Action, toogleModal } = this.props
        if (selectMap) {
          for (let i = 0; i < mapFields.length; i++) {
            if (!mapFields[i]) {
              mapFields.splice(i, 1)
              i--
            }
          }
        }
        if (selectDefaultV) {
          for (let i = 0; i < defaultVList.length; i++) {
            if (!defaultVList[i]) {
              defaultVList.splice(i, 1)
              i--
            }
          }
        }
        Action(!selectMap && !selectDefaultV ? null : JSON.stringify({ ...values, defaultVList, mapFields }))
        toogleModal()
      } else {
        return message.error('保存失败')
      }
    })
  }
  render() {
    const { form, PROPERTYPARAM, visible, toogleModal, ITEMA, pItemNo } = this.props
    const { getFieldDecorator } = form
    const { mapCount, sfieldList = [], tfieldList = [], defaultVCount } = this.state
    const { mapFields, itemNo, selectMap, selectDefaultV, defaultVList } = JSON.parse(PROPERTYPARAM || '{}')
    return (
      <Modal width={700} title='属性页参数' visible={visible} onOk={this.Ok} onCancel={toogleModal}>
        <Form style={{ width: '100%' }}>
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', fontWeight: 'bold' }}>
            <div style={{ width: '94%' }}>
              <FormItem label='映射字段' {...formItemLayout2} style={{ marginBottom: 0 }}>
                {getFieldDecorator('selectMap', {
                  rules: [{ required: true, message: '此项必填!' }],
                  initialValue: selectMap || false,
                  valuePropName: 'checked'
                })(<Checkbox onChange={this.onSelectMapChange} />)}
              </FormItem>
            </div>
            {this.state.selectMap && (
              <Fragment>
                <div style={{ width: '94%' }}>
                  <FormItem label='对象标识' {...formItemLayout2} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('itemNo', {
                      rules: [{ required: true, message: '此项必填!' }],
                      initialValue: itemNo || pItemNo
                    })(
                      <Radio.Group onChange={this.onChange}>
                        <Radio value={pItemNo}>{pItemNo}(自身)</Radio>
                        {ITEMA && <Radio value={ITEMA}>{ITEMA}(父对象)</Radio>}
                      </Radio.Group>
                    )}
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
              </Fragment>
            )}
            <div style={{ width: '94%' }}>
              <FormItem label='设置缺省值' {...formItemLayout2} style={{ marginBottom: 0 }}>
                {getFieldDecorator('selectDefaultV', {
                  rules: [{ required: true, message: '此项必填!' }],
                  initialValue: selectDefaultV || false,
                  valuePropName: 'checked'
                })(<Checkbox onChange={this.onDefaultVChange} />)}
              </FormItem>
            </div>
            {this.state.selectDefaultV && (
              <Fragment>
                {defaultVCount.map(item => (
                  <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }} key={item}>
                    <div style={{ width: '47%' }}>
                      <FormItem label='目标字段' {...formItemLayout} style={{ marginBottom: 0 }}>
                        {getFieldDecorator(`defaultVList[${item}]['field']`, {
                          rules: [{ required: true, message: '此项必填!' }],
                          initialValue: defaultVList && defaultVList[item] ? defaultVList[item].field : ''
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
                    <div style={{ width: '47%' }}>
                      <FormItem label='缺省值' {...formItemLayout} style={{ marginBottom: 0 }}>
                        {getFieldDecorator(`defaultVList[${item}]['value']`, {
                          rules: [{ required: true, message: '此项必填!' }],
                          initialValue: defaultVList && defaultVList[item] ? defaultVList[item].value : ''
                        })(<Input />)}
                      </FormItem>
                    </div>
                    {defaultVCount.length > 1 && (
                      <div style={{ width: '5%', display: 'flex', alignItems: 'center' }}>
                        <Icon
                          className='dynamic-delete-button'
                          type='minus-circle-o'
                          onClick={() => this.editField('defaultVCount', item)}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ width: '100%' }}>
                  <Button type='dashed' onClick={() => this.editField('defaultVCount')} style={{ marginRight: '5px' }}>
                    <Icon type='plus' /> 添加
                  </Button>
                </div>
              </Fragment>
            )}
          </div>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(PropertyParamForm)
