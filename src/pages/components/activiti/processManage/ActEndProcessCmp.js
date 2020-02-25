/**
 * @author lwp
 */
import React from 'react'
import { Table } from 'antd/lib/index'
import { RefreshButton } from '../../common/Buttons'
import ProcessActinst from '../../../routes/activiti/activitiCommon/ProcessActinst'
import ProcessActivityPng from '../../../routes/activiti/activitiCommon/ProcessActivityPng'

const ActRunProcessCmp = ({ list, columns, pagination, refresh }) => {
  return (
    <div>
      {/*刷新*/}
      <RefreshButton onClick={refresh} />
      <Table bordered dataSource={list} columns={columns} size='small' pagination={pagination} />
      {/*流程图*/}
      <ProcessActivityPng />
      {/*流转信息*/}
      <ProcessActinst />
    </div>
  )
}
export default ActRunProcessCmp
