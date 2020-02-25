/**
 * @author lwp
 */
import React from 'react'
import { Table } from 'antd/lib/index'
import { RefreshButton } from '../../common/Buttons'
import ProcessDetails from '../../../routes/activiti/activitiCommon/ProcessActinst'
import ProcessActivityPng from '../../../routes/activiti/activitiCommon/ProcessActivityPng'

const ActMyProcessCmp = ({ list, columns, pagination, refresh }) => {
  return (
    <div>
      {/*刷新*/}
      <RefreshButton onClick={refresh} />
      <Table bordered dataSource={list} columns={columns} size='small' pagination={pagination} />
      {/*流程进度图片*/}
      <ProcessActivityPng />
      {/*流转详情*/}
      <ProcessDetails />
    </div>
  )
}
export default ActMyProcessCmp
