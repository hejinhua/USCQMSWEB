/*
 * @Author: hjh
 * @Date: 2019-07-24 16:06:29
 * @LastEditTime: 2019-11-28 14:52:42
 * @Descripttion: 左右布局高阶组件
 */
import React, { Component } from 'react'
import { Icon, Tabs, Tooltip } from 'antd'
import DragCmp from '../../common/DragCmp'

import styles from '../engine.css'

const TabPane = Tabs.TabPane
const LeftAndRightHoc = engine => WrappedComponent => {
  return class extends Component {
    onClick(record) {
      const { itemRelationPage, menuId, itemNo, namespace, facetype } = engine
      if (!itemRelationPage || itemRelationPage.length === 0) {
        return
      }
      this.props.dispatch({
        type: `popup/loadSubpage`,
        payload: { itemRelationPage, record, facetype, pNameSpace: namespace, menuId, itemA: itemNo }
      })
      if (!this.props.model.showTab) {
        this.props.dispatch({ type: `${namespace}/packet`, payload: { showTab: true } })
      }
    }

    close() {
      this.props.dispatch({ type: `${engine.namespace}/packet`, payload: { showTab: false } })
    }

    render() {
      const { showTab, panes } = this.props.model
      return (
        <div className={styles.flexX}>
          <DragCmp width={showTab ? '30%' : '100%'} canResizing={{ right: true }} showTab={showTab}>
            <WrappedComponent {...this.props} onClick={this.onClick.bind(this)} />
          </DragCmp>
          {showTab && (
            <div className={styles.flexGrowX}>
              <Tabs
                defaultActiveKey={panes[0] && panes[0].key}
                tabBarExtraContent={
                  <Tooltip title='关闭'>
                    <Icon type='close' onClick={this.close.bind(this)} className='tab_bar_icon' />
                  </Tooltip>
                }
              >
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
            </div>
          )}
        </div>
      )
    }
  }
}
export default LeftAndRightHoc
