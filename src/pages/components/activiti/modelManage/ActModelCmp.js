/**
 * @author lwp
 */
import React from 'react'
import { Table, Modal } from 'antd/lib/index'
import ActModelForm from './ActModelForm'
import { AddButton, RefreshButton } from '../../common/Buttons'

const ActModelCmp = ({ list, columns, pagination, onCancel, visible, showM, record, refresh, processTypes }) => {
  return (
    <div>
      {/*添加*/}
      <AddButton onClick={showM} />
      {/*刷新*/}
      <RefreshButton onClick={refresh} />
      <Modal
        width={600}
        title='模型管理'
        visible={visible}
        onCancel={onCancel}
        destroyOnClose='true'
        footer={null}
        centered={true}
        mask={false}
        maskClosable={false}
      >
        <ActModelForm record={record} processTypes={processTypes} />
      </Modal>

      <Table bordered dataSource={list} columns={columns} size='small' pagination={pagination} />
    </div>
  )
}
export default ActModelCmp
