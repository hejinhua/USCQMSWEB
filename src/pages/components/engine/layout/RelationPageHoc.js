/*
 * @Author: hjh
 * @Date: 2019-08-19 09:25:21
 * @LastEditTime: 2019-10-23 11:13:03
 * @Descripttion: 关联页弹窗高阶组件
 */
import React, { Component } from 'react'
import { Icon, Tabs } from 'antd'

import styles from '../engine.css'

const TabPane = Tabs.TabPane
const RelationPageHoc = WrappedComponent => {
  return class extends Component {
    render() {
      let { panes } = this.props.model
      return (
        <div className={styles.relationPage}>
          <Tabs defaultActiveKey={panes[0] && panes[0].key}>
            {panes.map(pane => (
              <TabPane
                className='tab_pane'
                tab={
                  <span>
                    <Icon type={pane.icon} />
                    {pane.title}
                  </span>
                }
                key={pane.key}
              >
                {pane.content}
              </TabPane>
            ))}
          </Tabs>
          <WrappedComponent />
        </div>
      )
    }
  }
}
export default RelationPageHoc
