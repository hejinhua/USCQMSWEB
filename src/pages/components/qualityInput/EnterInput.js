/*
 * @Author: hjh
 * @Date: 2019-08-15 10:50:15
 * @LastEditTime: 2019-08-17 14:37:50
 * @Descripttion: 回车录入相关组件
 */
import React from 'react'
import { Button, Input, List, message, notification } from 'antd'
import { connect } from 'dva'

class EnterInput extends React.Component {
  state = {
    value: '',
    data: [],
    isFirst: true,
    clickSubmit: false
  }

  componentWillReceiveProps(nextProps) {
    const { selectedRows } = nextProps
    if (selectedRows !== this.props.selectedRows) {
      this.current = 0
      this.total = 0
      this.setState({
        value: '',
        data: [],
        isFirst: true,
        clickSubmit: false
      })
    }
  }

  onPressEnter = e => {
    const value = e.target.value.trim()
    const x = this.x
    const y = this.y
    const { data, clickSubmit } = this.state
    if (clickSubmit) {
      message.warn('已完成录入，检验完成！')
      return
    }
    if (!data || data.length === 0) {
      message.warn('请点击开始录入！')
      return
    }
    if (x === this.rowLen - 1 && y === data[x].length - 1 && this.current === this.total) {
      message.warn('输入完成！')
    } else {
      if (value === '') {
        message.warn('请输入内容！')
      } else {
        const colLen = data[x].length
        const { maxval, minval } = this.inspectItems[x]
        let resultremark = '合格'
        if (typeof maxval === 'number') {
          resultremark = value > maxval ? '大于上限' : value < minval ? '小于下限' : '合格'
        }
        if (data[x][y].insresult === '') {
          this.current++
        }
        data[x][y] = { ...data[x][y], insresult: value, resultremark }
        if (y < colLen - 1) {
          this.y++
        } else if (x < this.rowLen - 1) {
          this.y = 0
          this.x++
        }
        this.setState({ data, value: '' })
      }
    }
  }

  onChange = e => {
    this.setState({
      value: e.target.value
    })
  }

  onSubmit = () => {
    if (this.current === this.total && this.state.data.length > 0) {
      const { selectedRows, itemNo, dispatch } = this.props
      const payload = {
        otherParam: this.state.data,
        hData: selectedRows,
        itemNo,
        implclass: 'com.usc.app.action.ins.SaveInspectionResultAction'
      }
      dispatch({
        type: 'enterInput/start',
        payload,
        callback: res => {
          const { flag, info } = res
          if (flag) {
            message.info(info)
            this.props.dispatch({ type: 'qualityInput/query' })
            this.setState({ clickSubmit: true })
          } else {
            notification.error({
              message: info,
              duration: 0
            })
          }
        }
      })
    } else {
      message.warn('请完成录入！')
    }
  }

  startInput = () => {
    const { selectedRows, itemNo, dispatch } = this.props
    const payload = {
      itemNo,
      hData: selectedRows,
      implclass: 'com.usc.app.action.ins.InspectStartEntryAction'
    }
    dispatch({
      type: 'enterInput/start',
      payload,
      callback: res => {
        const { inspectItems, serialNumbers, flag, info } = res
        if (flag) {
          this.inspectItems = inspectItems
          this.serialNumbers = serialNumbers
          this.rowLen = inspectItems.length
          this.x = 0
          this.y = 0
          this.total = 0
          this.current = 0
          let data = []
          inspectItems.forEach(item => {
            let snumberArr = []
            const { snumber, name, workcenter } = item
            for (let i = 0; i < snumber; i++) {
              snumberArr[i] = {
                insresult: '',
                no: serialNumbers[i],
                insobjname: name,
                workcenter: workcenter
              }
            }
            this.total += snumber
            data.push(snumberArr)
          })
          this.setState({ data, isFirst: false })
        } else {
          this.total = 0
          this.current = 0
          this.setState({ data: [] })
          notification.error({
            message: info,
            duration: 0
          })
        }
      }
    })
  }

  clickListItem = (i, j) => () => {
    this.x = i
    this.y = j
    this.input.focus()
    this.forceUpdate()
  }

  render() {
    const { value, data, isFirst, clickSubmit } = this.state
    const { inspectItems, x, y } = this
    return (
      <div
        style={{
          padding: '8px',
          boxSizing: 'border-box',
          overflow: 'scroll',
          width: '100%',
          height: '100%',
          display: 'flex'
        }}
      >
        <div style={{ width: '85%' }}>
          <div style={{ width: '100%', display: 'flex' }}>
            <Input
              onPressEnter={this.onPressEnter}
              onChange={this.onChange}
              value={value}
              style={{ flexGrow: 1, marginBottom: '8px', minWidth: '100px' }}
              ref={ele => {
                this.input = ele
              }}
            />
            <Button type='primary' onClick={this.startInput} style={{ marginLeft: '8px' }} disabled={clickSubmit}>
              {isFirst ? '开始录入' : '重新录入'}
            </Button>
            <Button type='primary' onClick={this.onSubmit} style={{ marginLeft: '8px' }} disabled={clickSubmit}>
              确认
            </Button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', alignItems: 'flex-start' }}>
            {data &&
              data.map((i, j) => (
                <List
                  key={j}
                  size='small'
                  header={<div style={{ fontWeight: 'bold' }}>{i[0].insobjname}</div>}
                  bordered
                  dataSource={i}
                  style={{ width: '200px', marginRight: '8px' }}
                  renderItem={(item, index) => (
                    <List.Item
                      onClick={this.clickListItem(j, index)}
                      style={{ background: j === x && index === y ? '#baefe1' : '' }}
                    >
                      {item.insresult}
                      <span style={{ float: 'right', color: item.resultremark === '合格' ? 'green' : 'red' }}>
                        {item.resultremark}
                      </span>
                    </List.Item>
                  )}
                />
              ))}
          </div>
        </div>
        {data && data[0] && (
          <div style={{ width: '15%', padding: '20px', fontWeight: 'bold' }}>
            <p>{inspectItems[x].name}</p>
            <p>上限：{inspectItems[x].maxval}</p>
            <p>目标值：{inspectItems[x].tarvalue}</p>
            <p>下限：{inspectItems[x].minval}</p>
          </div>
        )}
      </div>
    )
  }
}

export default connect()(EnterInput)
