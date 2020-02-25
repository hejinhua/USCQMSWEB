import React from 'react'
import { Tabs, Button } from 'antd'
import GlobalTableForm from './GlobalTableForm'
import DragCmp from '../common/DragCmp'
import TableWithBtn from '../common/TableWithBtn'
import GlobalField from './GlobalField'

const TabPane = Tabs.TabPane

const RelationshipCmp = ({ showTab, disabled, PID, tableProps, formProps, closeTab }) => {
  const closeBtn = <Button type='default' icon='close' onClick={closeTab} />
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <DragCmp height={showTab ? '50%' : '100%'} canResizing={{ bottom: true }} showTab={showTab}>
        <TableWithBtn {...tableProps} />
      </DragCmp>
      {showTab && (
        <div style={{ flexGrow: '1', width: '100%', height: '5px' }}>
          <Tabs tabBarExtraContent={closeBtn}>
            <TabPane tab='表格字段' key='1'>
              <GlobalField disabled={disabled} PID={PID} />
            </TabPane>
          </Tabs>
        </div>
      )}
      <GlobalTableForm {...formProps} />
    </div>
  )
}
export default RelationshipCmp
