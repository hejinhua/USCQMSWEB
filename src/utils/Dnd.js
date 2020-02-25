import { Component } from 'react'
import { DragSource, DropTarget } from 'react-dnd'

let dragingIndex = -1

/**
 * @desc 拖拽表格行组件，使用时需在engine包裹table处进行拖拽高阶包裹，并将此组件输出的components引入到Table组件上
 * @date 2019-06-12
 * @author zxy
 */
class BodyRow extends Component {
  render() {
    //moveRow如果删除会报警告
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props
    const style = { ...restProps.style, cursor: 'move' }
    let className = restProps.className
    let index = restProps.children[0].props.index //采用高阶组件包裹，需设置选中行下标
    if (isOver) {
      if (index > dragingIndex) {
        className += ' drop-over-downward'
      }
      if (index < dragingIndex) {
        className += ' drop-over-upward'
      }
    }

    return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />))
  }
}
const rowSource = {
  beginDrag(props) {
    // console.log(props.children[0].props.record)
    dragingIndex = props.children[0].props.record.index
    return {
      index: dragingIndex
    }
  }
}

const rowTarget = {
  drop(props, monitor) {
    // console.log(props.children[0].props.record)
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.children[0].props.record.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  }
}
const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource()
  }))(BodyRow)
)
const components = {
  body: {
    row: DragableBodyRow
  }
}
export default components
