/*
 * @Author: hjh
 * @Date: 2019-05-17 14:17:46
 * @Last Modified by: hjh
 * @Last Modified time: 2019-07-02 11:35:17
 * 可拖动、拉伸组件
 */
import React, { Component, Fragment } from 'react'
import { Rnd } from 'react-rnd'

class DragCmp extends Component {
  static defaultProps = {
    canDragging: false, // 是否可拖动，默认不可
    position: {
      x: 0, // 位置
      y: 0
    },
    canResizing: {
      right: true, // 可拖动边框,默认右边和下边
      bottom: true
    },
    bounds: 'window', // 拖动的范围，值为class名
    maxWidth: '100%',
    minWidth: '10%',
    maxHeight: '100%',
    minHeight: '5%',
    width: '100%',
    height: '100%',
    showTab: false
  }

  state = {
    width: '100%',
    height: '100%'
  }

  componentDidMount() {
    const { width, height, showTab } = this.props
    this.setState({ width, height, showTab, rwidth: '100%', rheight: '100%' })
  }

  componentWillReceiveProps(nextProps) {
    const { width, height, showTab } = this.props
    const { width: nextW, height: nextH, showTab: nextShow } = nextProps
    if (width !== nextW) {
      this.setState({ width: nextW, rwidth: '100%', rheight: '100%' })
    }
    if (height !== nextH) {
      this.setState({ height: nextH, rwidth: '100%', rheight: '100%' })
    }
    if (showTab !== nextShow) {
      this.setState({ showTab: nextShow })
    }
  }

  onResize = (e, direction, ref) => {
    if (direction === 'right') {
      this.setState({
        width: ref.offsetWidth,
        rwidth: ref.offsetWidth
      })
    } else {
      this.setState({
        height: ref.offsetHeight,
        rheight: ref.offsetHeight
      })
    }
  }

  onDragStop = (e, d) => {
    this.setState({ x: d.x, y: d.y })
  }

  render() {
    const { height, width, showTab, rwidth, rheight } = this.state
    const { canResizing, canDragging, position } = this.props
    const { bottom = false, right = false } = canResizing
    const cmp = (
      <Rnd
        size={{ width: bottom ? rwidth : width, height: bottom ? rheight : height }}
        position={position}
        disableDragging={!canDragging}
        enableResizing={showTab && canResizing}
        onResize={this.onResize}
        onDragStop={this.onDragStop}
        style={{
          borderBottom: showTab && bottom ? '2px solid rgb(193, 193, 193)' : 'none',
          borderRight: showTab && right ? '2px solid rgb(193, 193, 193)' : 'none',
          boxSizing: 'border-box',
          zIndex: 3
          // overflow: 'hidden'
        }}
        // maxHeight={bottom && showTab ? '80%' : '100%'}
        maxWidth={right && showTab ? '90%' : '100%'}
        minHeight='20%'
        minWidth='10%'
      >
        {this.props.children}
      </Rnd>
    )
    return <Fragment>{bottom ? <div style={{ width, height }}>{cmp}</div> : cmp}</Fragment>
  }
}

export default DragCmp
