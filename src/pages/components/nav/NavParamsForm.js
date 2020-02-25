import React, { Component, Fragment } from 'react'
import { Form, Input, Select, Icon, message } from 'antd'
import { connect } from 'dva'
import * as commonService from '../../service/commonService'
import Modal from '../common/Modal'
import SelectItemNo from '../tableConfig/SelectItemNo'
import SortFieldsForm from './SortFieldsForm'

const Option = Select.Option
const FormItem = Form.Item
const TextArea = Input.TextArea
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
const tableNames = ['usc_model_grid', 'usc_model_relationpage']
const conditions = ['TYPE in (0,1)', 'TYPE = 3', 'TYPE in (0,1)']
const fields = ['classItemNo', 'classNodeItemNo', 'itemNo']

class NavParamsForm extends Component {
  state = { usc_model_property: [] }
  componentDidMount() {
    const { PARAMS, FACETYPE } = this.props.record
    if (PARAMS) {
      let values = JSON.parse(PARAMS)
      if (values) {
        this.selectChange(values.itemNo)
      }
    }
    if (FACETYPE === 5) {
      this.props.dispatch({ type: 'autoClass/query', payload: {} })
    }
  }

  Ok = e => {
    e.preventDefault()
    if (this.childForm) {
      this.childForm.Ok(e, (flag, sortFields) => {
        if (flag) {
          this.props.form.validateFields((err, values) => {
            if (!err) {
              values.sortFields = sortFields
              for (let val in values) {
                if (values[val] && values[val].trim() === '') delete values[val]
              }
              const { record, PID } = this.props
              const newValues = { PARAMS: JSON.stringify(values), ID: record.ID }
              this.props.dispatch({ type: 'nav/addOrEdit', payload: { values: newValues, oldValues: record, PID } })
            } else {
              return message.error('保存失败')
            }
          })
        }
      })
    }
  }

  selectChange = itemNo => {
    tableNames.forEach(tableName => {
      commonService.get('/sysModelItem/queryItemPGR', { itemNo, tableName }).then(res => {
        if (res && res.data) {
          this.setState({ [tableName]: res.data.dataList })
        }
      })
    })
    commonService.get('/sysModelItem/queryItemFields', { itemNo }).then(res => {
      this.setState({ fieldList: res.data })
    })
  }

  onViewNoChange = (value, option) => {
    this.props.form.setFieldsValue({ ITEMNO: option.key })
    this.selectChange(option.key)
  }

  showSelectItemNo = type => () => {
    this.props.dispatch({
      type: 'selectItemNo/query',
      payload: { condition: conditions[type], onSelect: this.itemNoSelect }
    })
    this.type = type
  }

  itemNoSelect = rows => {
    let obj = {}
    obj[fields[this.type]] = rows[0].ITEMNO
    this.props.form.setFieldsValue(obj)
    if (this.type === 2) this.selectChange(rows[0].ITEMNO)
  }

  render() {
    const { form, autoClass, record } = this.props
    const { getFieldDecorator } = form
    const { FACETYPE, PARAMS } = record
    const {
      itemGridNo,
      itemRelationPageNo,
      classItemNo,
      itemNo,
      condition,
      viewNo,
      classNodeItemNo,
      sortFields
    } = JSON.parse(PARAMS || '{}')
    const { usc_model_grid = [], usc_model_relationpage = [], fieldList } = this.state
    const { list = [] } = autoClass
    return (
      <Form onSubmit={this.Ok}>
        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', fontWeight: 'bold' }}>
          {FACETYPE === 4 && (
            <Fragment>
              <div style={{ width: '50%' }}>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='分类对象标识'>
                  {getFieldDecorator('classItemNo', {
                    initialValue: classItemNo
                  })(<Input disabled addonAfter={<Icon type='plus' onClick={this.showSelectItemNo(0)} />} />)}
                </FormItem>
              </div>
              <div style={{ width: '50%' }}>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='节点对象标识'>
                  {getFieldDecorator('classNodeItemNo', {
                    initialValue: classNodeItemNo
                  })(<Input disabled addonAfter={<Icon type='plus' onClick={this.showSelectItemNo(1)} />} />)}
                </FormItem>
              </div>
            </Fragment>
          )}
          {FACETYPE === 5 && (
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='视图标识'>
                {getFieldDecorator('viewNo', {
                  initialValue: viewNo
                })(
                  <Select style={{ width: '100%' }} onSelect={this.onViewNoChange}>
                    {list.map(item => (
                      <Option key={item.ITEMNO} value={item.NO}>
                        {item.NAME}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </div>
          )}
          <div style={{ width: '50%' }}>
            <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='业务对象标识'>
              {getFieldDecorator('itemNo', {
                initialValue: itemNo
              })(<Input disabled addonAfter={<Icon type='plus' onClick={this.showSelectItemNo(2)} />} />)}
            </FormItem>
          </div>
          <div style={{ width: '50%' }}>
            <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='表格标识'>
              {getFieldDecorator('itemGridNo', {
                initialValue: itemGridNo
              })(
                <Select style={{ width: '100%' }}>
                  {usc_model_grid.map(item => (
                    <Option key={item.ID} value={item.NO}>
                      {item.NAME}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </div>
          {FACETYPE !== 1 && (
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='关联页标识'>
                {getFieldDecorator('itemRelationPageNo', {
                  initialValue: itemRelationPageNo
                })(
                  <Select style={{ width: '100%' }}>
                    {usc_model_relationpage.map(item => (
                      <Option key={item.ID} value={item.NO}>
                        {item.NAME}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </div>
          )}
          {(FACETYPE === 1 || FACETYPE === 2) && (
            <div style={{ width: '50%' }}>
              <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='条件'>
                {getFieldDecorator('condition', {
                  initialValue: condition
                })(<TextArea placeholder={'查询条件'} />)}
              </FormItem>
            </div>
          )}
          <SortFieldsForm
            sortFields={sortFields}
            fieldList={fieldList || []}
            wrappedComponentRef={form => (this.childForm = form)}
          />
        </div>
        <SelectItemNo />
      </Form>
    )
  }
}

function mapStateToProps({ autoClass }) {
  return { autoClass }
}

export default Modal(connect(mapStateToProps)(Form.create()(NavParamsForm)))
