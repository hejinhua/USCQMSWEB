/**
 * @author lwp
 */
import React, { Component } from 'react'
import {Form, Input, Button, message, Col, Row, Table} from 'antd/lib/index'
import { connect } from 'dva/index'
import styles from './index.css'

const FormItem = Form.Item
class AdmissionTestForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  Ok = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //保存和更新数据
        this.props.dispatch({ type: 'actModel/create', payload: { values } })
      } else {
        return message.error('保存失败')
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form //声明验证
    // const { key, name, description } = this.props.record //声明record
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      }
    }
    const columns = [
      {
        title: '检验项目',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检验规格',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '单位',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '目标值',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '公差',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检验值',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '不良代码',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '不良原因',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '备注',
        dataIndex: 'address',
        key: 'address',
      }
    ];
    const dataSource = [];

    return (
      <div id='admissionTestForm' className={styles.bigContainer}>
        <Row>
          <Col span={12}>
            <div className={styles.container}>
              <div>质检单<span>基本信息</span></div>
              <div className={styles.formCon}>
                <Form>
                  <table width='100%'>
                    <tbody>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout}
                          style={{ marginBottom: 0 }}
                          label='操作员工号'>
                          {getFieldDecorator('one', {
                            rules: [{ required: true, message: '请输入操作员工号!' }],
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout}
                          style={{ marginBottom: 0 }}
                          label='质检单编号'>
                          {getFieldDecorator('two', {
                            rules: [{ required: true, message: '请输入质检单编号!' }],
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout}
                          style={{ marginBottom: 0 }}
                          label='质检模板'>
                          {getFieldDecorator('three', {
                            rules: [{ required: true, message: '请输入质检模板!' }],
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout}
                          style={{ marginBottom: 0 }}
                          label='检验类型'>
                          {getFieldDecorator('four', {
                            rules: [{ required: true, message: '请输入检验类型!' }],
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout}
                          style={{ marginBottom: 0 }}
                          label='物料批号'>
                          {getFieldDecorator('five', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout}
                          style={{ marginBottom: 0 }}
                          label='物料代码'>
                          {getFieldDecorator('six', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout}
                          style={{ marginBottom: 0 }}
                          label='物料名称'>
                          {getFieldDecorator('seven', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout}
                          style={{ marginBottom: 0 }}
                          label='批次数量'>
                          {getFieldDecorator('eight', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    </tbody>
                  </table>
                </Form>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.container}>
              <div>检验<span>数据录入</span></div>
              <div className={styles.formCon}>
                <Form>
                  <table width='100%'>
                    <tbody>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout1}
                          style={{ marginBottom: 0 }}
                          label='检验项目'>
                          {getFieldDecorator('nine', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout1}
                          style={{ marginBottom: 0 }}
                          label='检验规格'>
                          {getFieldDecorator('ten', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout1}
                          style={{ marginBottom: 0 }}
                          label='单位'>
                          {getFieldDecorator('eleven', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout1}
                          style={{ marginBottom: 0 }}
                          label='目标值'>
                          {getFieldDecorator('twelve', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout1}
                          style={{ marginBottom: 0 }}
                          label='公差'>
                          {getFieldDecorator('thirteen', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout1}
                          style={{ marginBottom: 0 }}
                          label='检验值'>
                          {getFieldDecorator('fourteen', {
                            rules: [{ required: true, message: '请输入检验值!' }],
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout1}
                          style={{ marginBottom: 0 }}
                          label='不良代码'>
                          {getFieldDecorator('fifteen', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout1}
                          style={{ marginBottom: 0 }}
                          label='不良原因'>
                          {getFieldDecorator('sixteen', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <FormItem
                          {...formItemLayout1}
                          style={{ marginBottom: 0 }}
                          label='备注'>
                          {getFieldDecorator('seventeen', {
                            initialValue: ''
                          })(<Input className={styles.input}/>)}
                        </FormItem>
                      </th>
                    </tr>
                    </tbody>
                  </table>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
        <div className={styles.btnCon}>
          <Button className={styles.btn} type='primary'>数据缓存</Button>
          <Button className={styles.btn} style={{background:'#00B050',border:'1px solid #00B050'}} type='primary'>合格</Button>
          <Button className={styles.btn} style={{background:'#C0504D',border:'1px solid #C0504D'}} type='primary'>不合格</Button>
          <Button className={styles.lastBtn} style={{background:'#F79646',border:'1px solid #F79646'}} type='primary'>待判定</Button>
        </div>
        <div className={styles.listCon}>
          <div className={styles.listTitle}>检验项目<label>明细</label></div>
          <div>
            <Table columns={columns} dataSource={dataSource} />
          </div>
        </div>
      </div>
    )
  }
}
//使用表单共享出去的方式
export default connect()(Form.create()(AdmissionTestForm))
