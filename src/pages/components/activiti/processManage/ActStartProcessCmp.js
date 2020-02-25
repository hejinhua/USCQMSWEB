/**
 * @author lwp
 */
import React from 'react'
import { Table, Modal } from 'antd/lib/index'

const ActStartProcessCmp = ({
  actVisible,
  actCancel,
  list,
  columns,
  pagination,
  changePicture,
  visible,
  pictureUrl
}) => {
  return (
    <div>
      <Modal
        width={800}
        title='选择流程'
        visible={actVisible}
        onCancel={actCancel}
        destroyOnClose='true'
        centered={true}
        footer={null}
      >
        <Table bordered dataSource={list} columns={columns} size='small' pagination={pagination} />
      </Modal>
      <Modal
        title='流程设计图'
        width={1000}
        onCancel={changePicture}
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
export default ActStartProcessCmp
