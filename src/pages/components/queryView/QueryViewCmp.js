import React from 'react'
import { Tabs, Button } from 'antd'
import QueryViewForm from './QueryViewForm'
import TableWithBtn from '../common/TableWithBtn'
import Menus from '../tableConfig/Menus'
import DragCmp from '../common/DragCmp'

const TabPane = Tabs.TabPane

const QueryViewCmp = ({ showTab, disabled, menuList, PID, ITEMNO, tableProps, formProps, closeTab }) => {
  const closeBtn = <Button type='default' icon='close' onClick={closeTab} />
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <DragCmp height={showTab ? '50%' : '100%'} canResizing={{ bottom: true }} showTab={showTab}>
        <TableWithBtn {...tableProps} />
      </DragCmp>
      {showTab && (
        <div style={{ flexGrow: '1', width: '100%', height: '5px' }}>
          <Tabs tabBarExtraContent={closeBtn} style={{ width: '100%' }}>
            <TabPane tab='页面菜单' key='1'>
              <Menus disabled={disabled} menuList={menuList} PID={PID} ITEMNO={ITEMNO} namespace='queryView' />
            </TabPane>
          </Tabs>
        </div>
      )}
      <QueryViewForm {...formProps} />
    </div>
  )
}

export default QueryViewCmp
