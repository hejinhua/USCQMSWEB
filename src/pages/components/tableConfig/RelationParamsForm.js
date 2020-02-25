/*
 * @Author: hjh
 * @Date: 2019-06-05 10:01:58
 * @Last Modified by: hjh
 * @Last Modified time: 2019-06-19 14:57:49
 */

import React, { Component } from 'react'
import { Form, message, Select, Typography, Input, Icon, Checkbox } from 'antd'
import { connect } from 'dva'
import SelectRelation from './SelectRelation'
import SelectQueryView from './SelectQueryView'
import SelectItemNo from './SelectItemNo'

import * as commonService from '../../service/commonService'

const FormItem = Form.Item
const { Title } = Typography
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
class RelationParamsForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectRtype: '',
      isEdit: false,
      mnoList: []
    }
  }

  componentDidMount() {
    const { ITEMNO, RELEVANCENO, selectRtype } = this.props
    if (RELEVANCENO) this.setState({ isEdit: true })
    if (ITEMNO) this.getMnoList(ITEMNO, selectRtype)
  }

  componentDidUpdate(prevProps) {
    const { selectRtype, ITEMNO } = this.props
    if (prevProps.selectRtype !== selectRtype) {
      this.props.form.resetFields()
      this.itemno = null
      if (ITEMNO) this.getMnoList(ITEMNO, selectRtype)
    }
  }

  getMnoList = (itemNo, selectRtype) => {
    commonService
      .get('/sysModelItem/queryItemPGR', {
        itemNo,
        tableName: selectRtype !== 'relationproperty' ? 'usc_model_grid' : 'usc_model_property'
      })
      .then(res => {
        if (res && res.data) {
          this.setState({ mnoList: res.data.dataList })
        }
      })
  }

  handleChange = (value, { key }) => {
    this.props.form.setFieldsValue({ RELEVANCENO: value, RELEVANCENAME: key })
  }

  itemNoSelect = rows => {
    const { ITEMNO } = rows[0]
    this.getMnoList(ITEMNO, this.props.selectRtype)
    this.itemno = ITEMNO
    this.props.form.setFieldsValue({ ITEMNO })
  }

  showRelevancenoSelect = () => {
    const { isEdit } = this.state
    const { selectRtype, dispatch } = this.props
    if (!isEdit) {
      if (this.itemno) {
        switch (selectRtype) {
          case 'relationpage':
            dispatch({
              type: 'selectRelation/query',
              payload: { condition: `ITEMB='${this.itemno}'`, onSelect: this.relevancenoSelectChange }
            })
            break
          case 'relationqueryview':
          case 'relationclassview':
            const tableName = selectRtype === 'relationqueryview' ? 'usc_model_queryview' : 'usc_model_classview'
            dispatch({
              type: 'selectQueryView/query',
              payload: { selectedItemNo: this.itemno, tableName, onSelect: this.relevancenoSelectChange }
            })
            break
          default:
            alert('wrong selectRtype')
        }
      } else {
        message.warning('请选择查询对象')
      }
    }
  }

  relevancenoSelectChange = data => {
    this.props.form.setFieldsValue({ RELEVANCENO: data.NO, RELEVANCENAME: data.NAME })
  }

  showItemNoSelect = () => {
    this.props.dispatch({
      type: 'selectItemNo/query',
      payload: { condition: `SITEM=0 AND TYPE in (0, 1)`, onSelect: this.itemNoSelect }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { selectRtype, ITEMNO, RELEVANCENO, RELEVANCENAME, ITEMGRID, SUPQUERY } = this.props
    const { isEdit, mnoList } = this.state

    return (
      <div>
        <Form onSubmit={this.Ok}>
          <Title level={4}>{selectRtype}</Title>
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', fontWeight: 'bold' }}>
            {selectRtype === 'relationproperty' ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                <div style={{ width: '50%' }}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='属性对象'>
                    {getFieldDecorator('ITEMNO', {
                      rules: [{ required: true, message: '必填!' }],
                      initialValue: ITEMNO
                    })(<Input disabled />)}
                  </FormItem>
                </div>
                <div style={{ width: '50%' }}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='属性页标识'>
                    {getFieldDecorator('RELEVANCENO', {
                      rules: [{ required: true, message: '必填!' }],
                      initialValue: RELEVANCENO
                    })(
                      <Select style={{ width: '100%' }} onChange={this.handleChange} disabled={isEdit}>
                        {mnoList.map(item => (
                          <Option value={item.NO} key={item.NAME}>
                            {item.NAME}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </div>
                <div style={{ width: '50%' }}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='属性页名称'>
                    {getFieldDecorator('RELEVANCENAME', {
                      rules: [{ required: true, message: '必填!' }],
                      initialValue: RELEVANCENAME
                    })(<Input disabled />)}
                  </FormItem>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                <div style={{ width: '50%' }}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关联对象'>
                    {getFieldDecorator('ITEMNO', {
                      rules: [{ required: true, message: '必填!' }],
                      initialValue: ITEMNO
                    })(
                      <Input
                        disabled
                        addonAfter={<Icon style={{ margin: '0' }} type='plus' onClick={this.showItemNoSelect} />}
                      />
                    )}
                  </FormItem>
                </div>
                <div style={{ width: '50%' }}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关联对象表格'>
                    {getFieldDecorator('ITEMGRID', {
                      rules: [{ required: true, message: '必填!' }],
                      initialValue: ITEMGRID
                    })(
                      <Select style={{ width: '100%' }} disabled={isEdit}>
                        {mnoList.map(item => (
                          <Option value={item.NO} key={item.ID}>
                            {item.NAME}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </div>
                <div style={{ width: '50%' }}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关系标识'>
                    {getFieldDecorator('RELEVANCENO', {
                      rules: [{ required: true, message: '必填!' }],
                      initialValue: RELEVANCENO
                    })(
                      <Input
                        disabled
                        addonAfter={<Icon style={{ margin: '0' }} type='plus' onClick={this.showRelevancenoSelect} />}
                      />
                    )}
                  </FormItem>
                </div>
                <div style={{ width: '50%' }}>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关系名称'>
                    {getFieldDecorator('RELEVANCENAME', {
                      rules: [{ required: true, message: '必填!' }],
                      initialValue: RELEVANCENAME
                    })(<Input disabled />)}
                  </FormItem>
                </div>
                {selectRtype !== 'relationproperty' && (
                  <div style={{ width: '50%' }}>
                    <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='支持搜索'>
                      {getFieldDecorator('SUPQUERY', {
                        initialValue: SUPQUERY === 0 ? false : true,
                        valuePropName: 'checked'
                      })(<Checkbox />)}
                    </FormItem>
                  </div>
                )}
              </div>
            )}
          </div>
        </Form>
        <SelectQueryView />
        <SelectRelation />
        <SelectItemNo />
      </div>
    )
  }
}

export default connect()(Form.create()(RelationParamsForm))
