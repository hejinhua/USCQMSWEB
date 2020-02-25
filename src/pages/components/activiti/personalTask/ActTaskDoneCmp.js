/**
 * @author lwp
 */
import React from 'react'
import { Table } from 'antd/lib/index'
import { RefreshButton } from '../../common/Buttons'
import ProcessActinst from '../../../routes/activiti/activitiCommon/ProcessActinst'

const ActTaskDoneCmp = ({ list, columns, pagination, refresh }) => {
  return (
    <div>
      {/*刷新*/}
      <RefreshButton onClick={refresh} />
      <Table bordered dataSource={list} columns={columns} size='small' pagination={pagination} />
      {/*流程详情*/}
      <ProcessActinst />
    </div>
  )
}
export default ActTaskDoneCmp
