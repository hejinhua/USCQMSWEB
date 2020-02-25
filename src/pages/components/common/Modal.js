/*
 * @Author: hjh
 * @Date: 2019-07-29 16:23:52
 * @LastEditTime : 2019-12-23 16:45:58
 * @Descripttion: 通用弹窗
 */
import { Component } from 'react'
import { Button } from 'antd'
import Modal from '../common/DragModal'

const ModalHoc = WrappedComponent => {
  return class extends Component {
    state = {
      loading: false
    }

    onOk = e => {
      const { onOK } = this.props
      if (onOK && typeof onOk === 'function') {
        onOK()
      } else {
        this.childForm.Ok(e, this.toogleLoading)
      }
    }

    toogleLoading = () => {
      this.setState({ loading: !this.state.loading })
    }

    componentWillReceiveProps() {
      this.setState({
        loading: false
      })
    }

    render() {
      const { width = 800, visible, title = '弹窗', toogleModal, okText = '确认', ...rest } = this.props
      return (
        <Modal
          width={width}
          title={title}
          visible={visible}
          onCancel={toogleModal}
          onOk={this.onOk}
          footer={[
            <Button key='back' onClick={toogleModal}>
              取消
            </Button>,
            <Button
              key='submit'
              type='primary'
              // loading={this.state.loading}
              onClick={this.onOk}
            >
              {okText}
            </Button>
          ]}
          {...rest}
        >
          <WrappedComponent
            style={{ marginTop: 8 }}
            {...this.props}
            wrappedComponentRef={form => (this.childForm = form)}
          />
        </Modal>
      )
    }
  }
}
export default ModalHoc
