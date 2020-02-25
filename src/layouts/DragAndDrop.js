import React from 'react'

const addEvent = (el, event, handler) => {
  if (!el) return
  if (el.attachEvent) {
    el.attachEvent('on' + event, handler)
  } else if (el.addEventListener) {
    el.addEventListener(event, handler, false)
  } else {
    el['on' + event] = handler
  }
}

const removeEvent = (el, event, handler) => {
  if (!el) return
  if (el.detachEvent) {
    el.detachEvent('on' + event, handler)
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler, false)
  } else {
    el['on' + event] = null
  }
}

/*拖拽组件*/
class DragAndDrop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /*定义两个值用来存放当前元素的left和top值*/
      needX: props.needX ? props.needX : document.body.clientWidth - props.style.width - 20,
      needY: props.needY ? props.needY : document.body.clientHeight / 2
    }
    /*定义两个值用来存放鼠标按下的地方距离元素上侧和左侧边界的值*/
    this.disX = 0
    this.disY = 0
  }
  /*定义鼠标下落事件*/
  fnDown = e => {
    /*事件兼容*/
    const event = e || window.event
    /*事件源对象兼容*/
    const target = event.target || event.srcElement
    if (target.style.cursor === 'move') {
      /*获取鼠标按下的地方距离元素左侧和上侧的距离*/
      this.disX = event.clientX - target.offsetLeft
      this.disY = event.clientY - target.offsetTop
      // /*定义鼠标移动事件*/
      addEvent(document, 'mousemove', this.fnMove)
      // /*定义鼠标抬起事件*/
      addEvent(document, 'mouseup', this.fnUp)
    }
  }
  /*定义鼠标移动事件*/
  fnMove = e => {
    /*事件兼容*/
    const event = e || window.event
    /*事件源对象兼容*/
    // eslint-disable-next-line no-unused-vars
    const target = event.target || event.srcElement
    this.setState({
      needX:
        event.clientX - this.disX > document.body.clientWidth - this.props.style.width - 20
          ? document.body.clientWidth - this.props.style.width - 20
          : event.clientX - this.disX < 0
          ? 10
          : event.clientX - this.disX,
      needY:
        event.clientY - this.disY > document.body.clientHeight - this.props.style.height - 20
          ? document.body.clientHeight - this.props.style.height - 20
          : event.clientY - this.disY < 0
          ? 10
          : event.clientY - this.disY
    })
    this.props.onMove({ offsetX: this.state.needX, offsetY: this.state.needY })
  }
  fnUp = () => {
    removeEvent(document, 'mousemove', this.fnMove)
    removeEvent(document, 'mouseup', this.fnUp)
  }

  //增加监听，页面窗口改变位置相应改变
  handle = () => {
    this.setState({
      needX: document.body.clientWidth - this.props.style.width - 20,
      needY: document.body.clientHeight / 2
    })
  }
  componentDidMount() {
    window.addEventListener('resize', this.handle)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handle)
  }

  render() {
    /*返回元素*/
    return (
      <div
        onMouseDown={this.fnDown}
        style={{
          width: this.props.style.width,
          height: this.props.style.height,
          backgroundColor: this.props.style.backgroundColor || '',
          position: 'absolute',
          border: this.props.style.border || '',
          left: this.state.needX,
          top: this.state.needY,
          // transform: `translate(${this.state.needX}px, ${this.state.needY}px)`,
          cursor: 'move'
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
export default DragAndDrop
