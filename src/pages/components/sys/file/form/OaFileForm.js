import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { connect } from 'dva'
// import HrEmpAllSelect from "../../../routes/select/HrEmpAllSelect";

const FormItem = Form.Item
const { TextArea } = Input

class OaFileForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  //打开修改人
  openHrEmpAll = () => {
    this.props.dispatch({ type: 'hrEmpAllSelect/query', payload: {} })
  }
  //把修改人值放入表单
  hrEmpAllSelectChange = (data) => {
    this.props.form.setFieldsValue({
      empId: data[0].id,
      empName: data[0].name
    })
  }
  Ok = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        delete values.cuser
        let folderId = this.props.folderId
        if (this.props.record.updateT == 'I') {
          values.updateT = this.props.record.updateT
        } else {
          //修改的时候
          values.id = this.props.record.id
        }

        //新增文件夹
        this.props.dispatch({
          type: 'oaFile/addOrEdit',
          payload: {
            values,
            userName: localStorage.getItem('userName'),
            folderId,
            fileByFolderId: this.props.fileByFolderId
          }
        })
      }
    })
  }
  //渲染
  render() {
    const { getFieldDecorator } = this.props.form
    const { name, remark } = this.props.record
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
    return (
      <div>
        <Form onSubmit={this.Ok}>
          <table width='550'>
            {' '}
            {/* width="772"*/}
            <tbody>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='名称'>
                    {' '}
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入名称!' }],
                      initialValue: name
                    })(<Input />)}
                  </FormItem>
                </th>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='创建人'>
                    {getFieldDecorator('cuser', {
                      rules: [{ required: false, message: '请选择创建人!' }],
                      initialValue: localStorage.getItem('userName')
                    })(<Input readOnly />)}
                  </FormItem>
                </th>
                {/* <th>
                <Button type="primary" icon="plus" onClick={this.openHrEmpAll}/>
              </th>*/}
              </tr>
              <tr>
                <th>
                  <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='备注'>
                    {getFieldDecorator('remark', {
                      initialValue: remark
                    })(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
                  </FormItem>
                </th>
                <th>
                  {/*  <FormItem
                  {...formItemLayout}
                  style={{marginBottom:0}}
                  label="创建时间"
                >{
                  getFieldDecorator('ctime', {
                    rules: [{ required: true, message: '请选择创建时间!' }],
                    initialValue:ctime
                  })(<DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                  />)
                }
                </FormItem>*/}
                </th>
              </tr>
            </tbody>
          </table>
          {/*  <FormItem
            {...formItemLayout}
            style={{marginBottom:0}}
            label=""
          >{
            getFieldDecorator('empId', {
              //rules: [{ required: true, message: '请选择创建人!' }],
              initialValue:empId,
            })(<Input hidden/>)
          }
          </FormItem>*/}
          <FormItem style={{ textAlign: 'right', marginTop: 20, marginBottom: 0 }}>
            <Button type='primary' htmlType='submit' className='login-form-button'>
              保存
            </Button>
          </FormItem>
          {/*<HrEmpAllSelect hrEmpAllSelectChange={this.hrEmpAllSelectChange}/>*/}
        </Form>
      </div>
    )
  }
}
export default connect()(Form.create()(OaFileForm))
