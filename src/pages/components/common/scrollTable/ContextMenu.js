/*
 * @Author: hjh
 * @Date: 2019-07-03 17:01:17
 * @LastEditTime: 2020-04-15 17:35:31
 * @Descripttion: table的右键菜单
 */
import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import { connect } from 'dva'

import { hideContextMenu } from '../../../../utils/contextMenuFunc'
import { clickBtn } from '../../../../utils/buttonFunc'

import styles from './style.less'

const { SubMenu } = Menu
const MenuItem = Menu.Item

class ContextMenu extends Component {
  static defaultProps = {}

  state = {
    top: this.props.top,
    left: this.props.left
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClick)
    this.getTopAndLeft(this.props)
    this.div.oncontextmenu = function() {
      return false
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) this.getTopAndLeft(this.props)
  }

  getTopAndLeft = props => {
    const { clientHeight, clientWidth } = document.documentElement
    const { left, top } = props
    const { width, height } = this.div.getBoundingClientRect()
    const x = left + width > clientWidth - 5 ? '-100%' : 0
    const y = top + height > clientHeight - 5 ? '-100%' : 0
    this.setState({
      transform: `translate(${x}, ${y})`
    })
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick)
  }

  handleClick = () => {
    hideContextMenu()
  }

  clickMenu = item => () => {
    const { model, engine } = this.props
    clickBtn(item, engine, model)
  }

  getMenus = (menus = [], parentId) => {
    if (!menus) {
      return
    }
    const res = []
    menus.forEach((item, index) => {
      if (item.pid === parentId) {
        const { name, id, disabled, icon } = item
        const title = icon ? (
          <span>
            <Icon type={icon} />
            {name}
          </span>
        ) : (
          name
        )
        if (item.mtype === '1') {
          res.push(
            <SubMenu key={index} title={title} className={styles.TreeSubMenu}>
              {this.getMenus(menus, id)}
            </SubMenu>
          )
        } else {
          //菜单项
          !disabled &&
            res.push(
              <MenuItem key={index} onClick={this.clickMenu(item)} className={styles.TreeMenu}>
                {title}
              </MenuItem>
            )
        }
      }
    })
    return res
  }

  render() {
    const { menus } = this.props
    const { transform } = this.state
    return (
      <div
        style={{
          transform,
          padding: '3px 0'
        }}
        ref={ele => {
          this.div = ele
        }}
      >
        <Menu mode='vertical' className={styles.menu}>
          {this.getMenus(menus, '0')}
          <MenuItem key='-1' className={styles.TreeMenu}>
            快速查找
          </MenuItem>
          <MenuItem key='-2' className={styles.TreeMenu}>
            查询全部
          </MenuItem>
          <MenuItem key='-3' className={styles.TreeMenu}>
            导出当前页
          </MenuItem>
          <MenuItem key='-4' className={styles.TreeMenu}>
            导出全部
          </MenuItem>
        </Menu>
      </div>
    )
  }
}
export default connect()(ContextMenu)
