import React from 'react'
import { connect } from 'dva'
import styles from './login.css'
import { Form, Input, Icon, Button } from 'antd'
import { showConfirm } from '../../../utils/utils'

class Login extends React.Component {
  state = { loading: false }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true })
        this.props.dispatch({
          type: 'login/login',
          payload: { values },
          callback: data => {
            this.setState({ loading: false })
            if (data) {
              showConfirm(() => {
                values.force = true
                this.setState({ loading: true })
                this.props.dispatch({
                  type: 'login/login',
                  payload: { values }
                })
              }, data.info)
            }
          }
        })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.main}>
        <div className={styles.loginTitle}>质量管理系统登录</div>
        <div className={styles.loginSubtitle}>Quality Management System Login</div>
        <div className={styles.loginCard}>
          <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
            <Form.Item>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入正确的用户名或工号！' }]
              })(
                <Input
                  size='large'
                  prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='用户名 '
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('userPassword', {
                rules: [{ required: true, message: '请输入正确的密码！' }]
              })(
                <Input
                  size='large'
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='密码 '
                  type='password'
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button size='large' type='primary' htmlType='submit' block icon='user' loading={this.state.loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

//对外接口规范
Login.propTypes = {}

const LoginForm = Form.create()(Login)
export default connect()(LoginForm)
