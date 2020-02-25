/*
 * @Author: hjh
 * @Date: 2019-12-12 11:42:37
 * @LastEditTime: 2019-12-13 17:09:14
 * @Descripttion: 导航菜单组件
 */
import React from 'react'
import { Button, Tabs } from 'antd'
import NavForm from './NavForm'
import NavParamsForm from './NavParamsForm'
import DragCmp from '../common/DragCmp'
import TableWithBtn from '../common/TableWithBtn'
import Menus from '../tableConfig/Menus'
const TabPane = Tabs.TabPane
const NavCmp = ({
  closeTab,
  showTab,
  menuList,
  PID,
  ITEMNO,
  classItemNo,
  tableProps,
  formProps,
  form2Props,
  disabled
}) => {
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
              <Menus
                activeKey='1'
                disabled={disabled}
                menuList={menuList}
                PID={PID}
                ITEMNO={ITEMNO}
                namespace='nav'
                classItemNo={classItemNo}
              />
            </TabPane>
          </Tabs>
        </div>
      )}
      <NavForm {...formProps} />
      <NavParamsForm {...form2Props} />
    </div>
  )
}

export default NavCmp
