/*
 * @Author: hjh
 * @Date: 2019-07-29 16:23:52
 * @LastEditTime: 2019-12-18 19:25:11
 * @Descripttion: 可拖动, 全屏弹窗
 */
import { Component } from 'react'
import { Modal, Icon } from 'antd'
import DragM from 'dragm'
import ReactDOM from 'react-dom'

import styles from './common.less'

class ModalTitle extends Component {
  updateTransform = transformStr => {
    this.props.updateTransform(transformStr)
  }

  render() {
    const { title } = this.props
    return (
      <DragM updateTransform={this.updateTransform}>
        <div>{title}</div>
      </DragM>
    )
  }
}

class DragModal extends Component {
  state = {
    isFull: false
  }

  updateTransform = transformStr => {
    const test = ReactDOM.findDOMNode(this.modal)
    this.modalDom = test.querySelector('.ant-modal')
    const { width, height } = this.modalDom.getBoundingClientRect()
    const { clientHeight, clientWidth } = document.documentElement
    const maxX = (clientWidth - width) / 2
    const maxY = (clientHeight - height) / 2
    let [x, y] = transformStr
      .slice(10, -1)
      .split(',')
      .map(item => parseInt(item))
    if (Math.abs(x) > maxX) {
      x = x > 0 ? maxX : -maxX
    }
    if (Math.abs(y) > maxY) {
      y = y > 0 ? maxY : -maxY
    }
    this.modalDom.style.transform = `translate(${x}px,${y}px)`
  }

  componentDidMount() {
    this.setState({ width: this.props.width })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) this.setState({ width: this.props.width, isFull: false })
  }

  toogleFullScreen = () => {
    const { isFull } = this.state
    const test = ReactDOM.findDOMNode(this.modal)
    this.modalBody = test.querySelector('.ant-modal-body')
    this.modalDom = test.querySelector('.ant-modal')
    if (isFull) {
      this.modalDom.style.transform = this.transform
      this.modalBody.style.height = 'auto'
      this.setState({ width: this.props.width, isFull: false })
    } else {
      this.transform = this.modalDom.style.transform
      this.modalDom.style.transform = `translate(0px, 0px)`
      this.modalBody.style.height = 'calc(100vh - 92px)'
      this.setState({ width: '100%', isFull: true })
    }
  }

  render() {
    const { isFull, width } = this.state
    const titleCmp = isFull ? (
      <span>{this.props.title}</span>
    ) : (
      <ModalTitle title={this.props.title} updateTransform={this.updateTransform} />
    )
    return (
      <Modal
        ref={ele => {
          this.modal = ele
        }}
        {...this.props}
        title={titleCmp || '弹窗'}
        destroyOnClose='true'
        centered={true}
        mask={true}
        maskClosable={false}
        width={width}
      >
        <Icon
          type={isFull ? 'fullscreen-exit' : 'fullscreen'}
          onClick={this.toogleFullScreen}
          className={styles.fullScreen}
        />
        {this.props.children}
      </Modal>
    )
  }
}
export default DragModal
