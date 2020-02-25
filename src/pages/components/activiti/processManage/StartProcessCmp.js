/**
 * @author lwp
 */
import React from 'react'
import { Table, Modal } from 'antd/lib/index'
import ActProcess from '../../../routes/activiti/ProcessManage/ActProcess'

const StartProcessCmp = ({ list, columns, pagination, changePicture, visible, pictureUrl }) => {
  return (
    <div>
      <Table bordered dataSource={list} columns={columns} size='small' pagination={pagination} />
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
      <ActProcess />
    </div>
  )
}
export default StartProcessCmp
