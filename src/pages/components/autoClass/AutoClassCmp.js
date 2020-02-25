/*
 * @Author: hjh
 * @Date: 2019-09-23 10:42:08
 * @LastEditTime: 2019-12-11 11:33:24
 * @Descripttion: 自动分类视图组件
 */

import React from 'react'
import AutoClassForm from './AutoClassForm'
import TableWithBtn from '../common/TableWithBtn'
import { Button, Tabs } from 'antd'
import DragCmp from '../common/DragCmp'
import ViewStructure from '../../routes/autoClass/ViewStructure'
import Menus from '../tableConfig/Menus'

const TabPane = Tabs.TabPane

class AutoClassCmp extends React.Component {
  render() {
    const {
      list,
      columns,
      visible,
      record,
      toogleModal,
      rowSelection,
      btns,
      itemOptions,
      closeTab,
      showTab,
      PID,
      disabled,
      changePane,
      activeKey,
      ITEMNO,
      menuList
    } = this.props
    const props = { btns, list, rowSelection, columns }
    const closeBtn = <Button type='default' icon='close' onClick={closeTab} />
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <DragCmp height={showTab ? '50%' : '100%'} canResizing={{ bottom: true }} showTab={showTab}>
          <TableWithBtn {...props} />
        </DragCmp>
        {showTab && (
          <div style={{ flexGrow: '1', width: '100%', height: '5px' }}>
            <Tabs tabBarExtraContent={closeBtn} onChange={changePane} activeKey={activeKey}>
              <TabPane tab='视图结构树' key='1'>
                <ViewStructure PID={PID} disabled={disabled} />
              </TabPane>
              <TabPane tab='页面菜单' key='2'>
                <Menus
                  activeKey={activeKey}
                  disabled={disabled}
                  menuList={menuList}
                  PID={PID}
                  ITEMNO={ITEMNO}
                  namespace='autoClass'
                />
              </TabPane>
            </Tabs>
          </div>
        )}
        <AutoClassForm
          title='自动分类视图管理'
          width={700}
          visible={visible}
          toogleModal={toogleModal}
          record={record || {}}
          options={itemOptions}
        />
      </div>
    )
  }
}
export default AutoClassCmp
