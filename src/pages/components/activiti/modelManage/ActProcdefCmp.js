/**
 * @author lwp
 */
import React from 'react'
import { Table, Modal } from 'antd/lib/index'
import { RefreshButton } from '../../common/Buttons'

const ActProcdefCmp = ({
  list,
  rowSelection,
  onRow,
  columns,
  pagination,
  refresh,
  changePicture,
  visible,
  pictureUrl,
  ACT_PROCESSMANAGE_ITEMCmp
}) => {
  return (
    <div>
      {/*刷新*/}
      <RefreshButton onClick={refresh} />
      <Table
        bordered
        rowSelection={rowSelection}
        dataSource={list}
        columns={columns}
        size='small'
        pagination={pagination}
        onRow={record => {
          return {
            onClick: () => {
              onRow(record.ID, record)
            } // 点击行
          }
        }}
      />
      <div style={{ height: 300 }}>
        <ACT_PROCESSMANAGE_ITEMCmp />
      </div>
      <Modal
        title='流程设计图'
        width={1000}
        onCancel={changePicture}
        rowSelection={rowSelection}
        destroyOnClose='true'
        visible={visible}
        footer={null}
        centered={true}
        mask={false}
        maskClosable={false}
      >
        <iframe
          title='op'
          src={pictureUrl}
          frameBorder='0'
          scrolling='no'
          style={{ width: '100%', height: 300, border: 0 }}
        />
      </Modal>
    </div>
  )
}
export default ActProcdefCmp
