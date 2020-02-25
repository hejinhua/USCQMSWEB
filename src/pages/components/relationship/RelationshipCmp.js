import React from 'react'
import { Tabs, Button } from 'antd'
import RelationForm from './RelationshipForm'
import DragCmp from '../common/DragCmp'
import TableWithBtn from '../common/TableWithBtn'
import Menus from '../tableConfig/Menus'

const TabPane = Tabs.TabPane

const RelationshipCmp = ({ showTab, disabled, menuList, PID, ITEMB, tableProps, formProps, closeTab, ITEMA }) => {
  const closeBtn = <Button type='default' icon='close' onClick={closeTab} />
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <DragCmp height={showTab ? '50%' : '100%'} canResizing={{ bottom: true }} showTab={showTab}>
        <TableWithBtn {...tableProps} />
      </DragCmp>
      {showTab && (
        <div style={{ flexGrow: '1', width: '100%', height: '5px' }}>
          <Tabs tabBarExtraContent={closeBtn}>
            <TabPane tab='关系菜单' key='1'>
              <Menus
                disabled={disabled}
                menuList={menuList}
                PID={PID}
                ITEMA={ITEMA}
                ITEMNO={ITEMB}
                namespace='relationship'
              />
            </TabPane>
          </Tabs>
        </div>
      )}
      <RelationForm {...formProps} />
    </div>
  )
}
export default RelationshipCmp
