/**
 * kate
 * 上传文件的修改表单
 */
import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item
class QcItemClassifyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  ClassifyOk = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        delete values.size
        if (this.props.record.updateT) {
          values.updateT = this.props.record.updateT
        } else {
          //修改的时候
          values.id = this.props.record.id
        }
        let folderId = `${this.props.folderId}`
        values.folderId = folderId
        //保存和更新数据去
        this.props.dispatch({ type: 'oaFile/addOrFileEdit', payload: { values, dataList: this.props.dataList } })
      } else {
        return
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form //声明验证
    const { name, remark, version, size } = this.props.record //声明record
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
      <Form onSubmit={this.ClassifyOk}>
        <table width='552'>
          <tbody>
            <tr>
              <th>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='文件名'>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入文件名!' }],
                    initialValue: name
                  })(<Input />)}
                </FormItem>
              </th>
              <th>
                {/* <FormItem
                {...formItemLayout}
                style={{marginBottom:0}}
                label="更新时间"
              >
                {getFieldDecorator('dtime', {
                  rules: [{ required: true, message: '请选择时间' }],
                  initialValue: gmtUpdate===null?undefined:moment(gmtUpdate),
                })(<DatePicker
                  format="YYYY-MM-DD"
                  placeholder="点击选择时间"/>)
                }
              </FormItem>*/}
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='备注'>
                  {getFieldDecorator('remark', {
                    rules: [{ required: false, message: '请输入备注!' }],
                    initialValue: remark
                  })(<Input />)}
                </FormItem>
              </th>
            </tr>
            <tr>
              <th>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='文件大小'>
                  {getFieldDecorator('size', {
                    rules: [{ required: false, message: '请输入文件大小!' }],
                    initialValue: size
                  })(<Input disabled />)}
                </FormItem>
              </th>
              <th>
                <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label='版本号'>
                  {getFieldDecorator('version', {
                    rules: [{ required: false, message: '请输入版本号!' }],
                    initialValue: version
                  })(<Input disabled />)}
                </FormItem>
              </th>
            </tr>
            {/*<tr>
            <th>

            </th>
            <th></th>
          </tr>*/}
          </tbody>
        </table>
        <FormItem style={{ textAlign: 'right', marginTop: 20, marginBottom: 0 }}>
          <Button type='primary' htmlType='submit' className='login-form-button'>
            保存
          </Button>
        </FormItem>
      </Form>
    )
  }
}
//使用表单共享出去的方式
export default connect()(Form.create()(QcItemClassifyForm))
