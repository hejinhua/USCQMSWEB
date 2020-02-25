import React from 'react'
import styles from './TabCmp.less'
import { Tabs, Icon, Spin } from 'antd'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
const TabPane = Tabs.TabPane
const menuMap = [
  { name: '关闭当前标签', data: { type: 1 } },
  { name: '关闭其它标签', data: { type: 2 } },
  { name: '关闭所有标签', data: { type: 3 } }
]

const TabCmp = ({ panes, activeKey, onChange, loading, closeTab, collect, onEdit }) => {
  return (
    <div>
      <Spin spinning={loading} delay={100} className={styles.spin}>
        <Tabs hideAdd animated={false} onChange={onChange} activeKey={activeKey} onEdit={onEdit} type='editable-card'>
          {panes.map(pane => (
            <TabPane
              className={styles.pane_div}
              tab={
                <ContextMenuTrigger
                  id='tab_header'
                  attributes={{ className: styles['right-click-tragger'] }}
                  collect={collect}
                  tabKey={pane.key}
                >
                  <div>
                    <Icon type={pane.icon} />
                    <span>{pane.title}</span>
                  </div>
                </ContextMenuTrigger>
              }
              key={pane.key}
              closable={pane.closable}
            >
              {pane.content}
            </TabPane>
          ))}
        </Tabs>
      </Spin>
      <ContextMenu id='tab_header' className={styles.contextMenu}>
        {menuMap.map((item, index) => (
          <MenuItem key={index} data={item.data} onClick={closeTab} attributes={{ className: styles.opt }}>
            {item.name}
          </MenuItem>
        ))}
      </ContextMenu>
    </div>
  )
}
export default TabCmp
