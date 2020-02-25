/*
 * @Author: hjh
 * @Date: 2019-07-29 13:57:11
 * @LastEditTime : 2019-12-23 16:51:14
 * @Descripttion: 配置平台组件
 */

import React from 'react'
import DragCmp from '../common/DragCmp'
import { Button, Tabs } from 'antd'
import TableConfigForm from './TableConfigForm'
import TableWithBtn from '../common/TableWithBtn'
import Field from './Field'
import Menus from './Menus'
import Property from './Property'
import Grid from './Grid'
import Relation from './Relation'
import DetailsForm from './DetailsForm'

const TabPane = Tabs.TabPane

const TableConfigCmp = ({
  toogleModal,
  onSearch,
  list,
  rowSelection,
  columns,
  showTab,
  activeKey,
  closeTab,
  changePane,
  visible,
  record,
  fieldList,
  onRowClick,
  PID,
  menuList,
  propertyList,
  propertyItemList,
  gridList,
  gridItemList,
  relationList,
  relationItemList,
  btns,
  disabled,
  ITEMNO,
  onDoubleClick,
  modalFooter
}) => {
  const closeBtn = <Button type='default' icon='close' onClick={closeTab} />
  const props = {
    btns,
    onSearch,
    list,
    rowSelection,
    columns,
    onClick: onRowClick,
    namespace: 'tableConfig',
    onDoubleClick
  }
  const tabProps = { disabled, PID }
  const tabMap = [
    { name: '字段属性', cmp: <Field {...tabProps} fieldList={fieldList} /> },
    { name: '对象菜单', cmp: <Menus menuList={menuList} {...tabProps} ITEMNO={ITEMNO} namespace='tableConfig' /> },
    {
      name: '对象属性',
      cmp: <Property propertyList={propertyList} {...tabProps} propertyItemList={propertyItemList} />
    },
    { name: '对象表格', cmp: <Grid gridList={gridList} gridItemList={gridItemList} {...tabProps} /> },
    {
      name: '对象关联页',
      cmp: <Relation ITEMNO={ITEMNO} relationList={relationList} relationItemList={relationItemList} {...tabProps} />
    }
  ]
  let footer = {}
  if (!modalFooter) footer = { footer: null }
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <DragCmp height={showTab ? '50%' : '100%'} canResizing={{ bottom: true }} showTab={showTab}>
        <TableWithBtn {...props} />
      </DragCmp>
      {showTab && (
        <div style={{ flexGrow: '1', width: '100%', height: '5px' }}>
          <Tabs onChange={changePane} activeKey={activeKey} tabBarExtraContent={closeBtn}>
            {tabMap.map((item, index) => (
              <TabPane tab={item.name} key={index + 1}>
                {item.cmp}
              </TabPane>
            ))}
          </Tabs>
        </div>
      )}
      <TableConfigForm
        width={700}
        title='业务对象'
        visible={visible}
        toogleModal={toogleModal}
        record={record}
        fieldList={fieldList}
        list={list}
        {...footer}
      />
      <DetailsForm />
    </div>
  )
}
export default TableConfigCmp
