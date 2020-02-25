/**
 * @author lwp
 */
import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd/lib/index'
import { connect } from 'dva'

const FormItem = Form.Item
const { TextArea } = Input
class ProcessOpinionCmp extends Component {
  Ok = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.processInstanceId = this.props.processInstanceId
        //请求后台路径
        values.url = this.props.url
        //刷新路径
        values.refreshUrl = this.props.refreshUrl
        //审批数据
        values.rows = this.props.list
        this.props.dispatch({ type: 'processOpinion/submit', payload: { values } })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title={this.props.title}
        width={400}
        onOk={this.Ok}
        onCancel={this.props.onCancel}
        destroyOnClose='true'
        visible={this.props.visible}
        centered={true}
        mask={false}
        maskClosable={false}
      >
        <Form>
          <table width='350'>
            <tbody>
              <tr>
                <td>
                  <FormItem style={{ marginBottom: 0 }}>
                    {getFieldDecorator('options', {
                      rules: [{ required: true, message: '该项必填!' }]
                    })(<TextArea autosize={{ minRows: 5 }} />)}
                  </FormItem>
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </Modal>
    )
  }
}
//使用表单共享出去的方式
export default connect()(Form.create()(ProcessOpinionCmp))
