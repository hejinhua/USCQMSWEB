import { Component } from 'react'
import { Redirect } from 'dva/router'

/**
 * @desc 登录验证组件
 * @param engine
 * @returns {function(*)}
 * @constructor
 */
const Authornized = () => WrappedComponent => {
  return class extends Component {
    render() {
      return sessionStorage.getItem('isAuthenticated') === 'true' ? (
        <div>
          <WrappedComponent {...this.props} />
        </div>
      ) : (
        <Redirect to='/login' />
      )
    }
  }
}
export default Authornized
