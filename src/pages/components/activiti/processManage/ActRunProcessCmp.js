/**
 * @author lwp
 */
import React from 'react'
import { Table } from 'antd/lib/index'
import { RefreshButton } from '../../common/Buttons'
import ProcessActinst from '../../../routes/activiti/activitiCommon/ProcessActinst'
import ProcessActivityPng from '../../../routes/activiti/activitiCommon/ProcessActivityPng'
import ProcessOpinion from '../../../routes/activiti/activitiCommon/ProcessOpinion'

const ActRunProcessCmp = ({ list, columns, pagination, refresh }) => {
  return (
    <div>
      {/*刷新*/}
      <RefreshButton onClick={refresh} />
      <Table bordered dataSource={list} columns={columns} size='small' pagination={pagination} />
      {/*流程进度图片*/}
      <ProcessActivityPng />
      {/*流转详情*/}
      <ProcessActinst />
      {/*流程意见（作废）*/}
      <ProcessOpinion />
    </div>
  )
}
export default ActRunProcessCmp
