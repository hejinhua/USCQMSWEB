/**
 * @author lwp
 */
import React from 'react'
import { Table } from 'antd/lib/index'
import { RefreshButton } from '../../common/Buttons'
import ProcessActivityPng from '../../../routes/activiti/activitiCommon/ProcessActivityPng'
import ProcessActinst from '../../../routes/activiti/activitiCommon/ProcessActinst'

const ActTaskToDoCmp = ({ list, columns, pagination, refresh }) => {
  return (
    <div>
      {/*刷新*/}
      <RefreshButton onClick={refresh} />
      <Table bordered dataSource={list} columns={columns} size='small' pagination={pagination} />
      {/*流程办理*/}
      <ProcessActinst />
      {/*流程进度图片*/}
      <ProcessActivityPng />
    </div>
  )
}
export default ActTaskToDoCmp
