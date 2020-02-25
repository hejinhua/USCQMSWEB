import React from 'react'
import { Menu, Icon, Layout, Input, Dropdown, Switch } from 'antd'
import { connect } from 'dva'
import { ergodicRoot } from '../../../utils/utils'
import styles from './index.css'

const { Sider } = Layout
const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
const { Search } = Input
const styleMap = [
  { checked: '明亮', unChecked: '暗黑', name: 'theme' },
  { checked: '内嵌', unChecked: '垂直', name: 'mode' },
  { checked: '展开', unChecked: '收缩', name: 'collapsed' }
]
const LeftMenu = ({ dispatch, menu }) => {
  let { menuData = [], selectedKeys = [], theme, mode, collapsed } = menu
  const queryMeta = item => {
    dispatch({ type: 'tab/queryMeta', payload: { item } })
  }

  const treeMenuData = ergodicRoot(menuData, '1')
  const getMenus = (data = []) =>
    data.map(item => {
      const { children, ID, ICON, NAME } = item
      const title = (
        <span>
          {ICON && <Icon type={ICON} />}
          <span>{NAME}</span>
        </span>
      )
      if (children) {
        return (
          <SubMenu key={ID} title={title}>
            {getMenus(children)}
          </SubMenu>
        )
      } else {
        return (
          <MenuItem key={ID} onClick={() => queryMeta(item)}>
            {title}
          </MenuItem>
        )
      }
    })

  //改变主题
  const changeStyle = type => () => {
    dispatch({ type: 'menu/changeStyle', payload: type })
  }

  const onSearch = value => {
    if (value) {
      let selectedKeys = []
      menuData.filter(item => item.NAME.includes(value)).forEach(i => selectedKeys.push(i.ID))
      dispatch({ type: 'menu/packet', payload: { selectedKeys } })
    } else {
      dispatch({ type: 'menu/packet', payload: { selectedKeys: [] } })
    }
  }

  const tool = (
    <Menu>
      {styleMap.map(item => (
        <Menu.Item key={item.name}>
          <Switch
            checkedChildren={item.checked}
            unCheckedChildren={item.unChecked}
            defaultChecked
            checked={!menu[item.name]}
            onChange={changeStyle(item.name)}
          />
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ height: '40px', background: theme ? '#001529' : '#fff' }}>
        {!collapsed && <Search placeholder='请输入菜单名' onSearch={onSearch} className={styles.menuSearch} />}
        <Dropdown overlay={tool}>
          <Icon
            type='tool'
            className={styles.toolIcon}
            style={{ width: !collapsed ? 40 : '100%' }}
            theme='twoTone'
            twoToneColor={theme && '#fff'}
          />
        </Dropdown>
      </div>
      <Menu
        selectedKeys={selectedKeys}
        mode={mode ? 'vertical' : 'inline'}
        theme={theme ? 'dark' : 'light'}
        className={styles.leftMenu}
      >
        {getMenus(treeMenuData)}
      </Menu>
    </Sider>
  )
}

function mapStateToProps({ menu }) {
  return { menu }
}

export default connect(mapStateToProps)(LeftMenu)
