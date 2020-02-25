/**
 * @author lwp
 */
import React from 'react'
import { Modal } from 'antd/lib/index'

const ProcessActivityPngCmp = ({ visible, onCancel, processInstanceId }) => {
  return (
    <Modal
      title='查看流程历史'
      width={1000}
      onCancel={onCancel}
      destroyOnClose='true'
      visible={visible}
      footer={null}
      centered={true}
      mask={false}
      maskClosable={false}
    >
      <iframe
        title='op'
        src={`api/act/process/getActivityPng/${processInstanceId}`}
        frameBorder='0'
        scrolling='no'
        style={{ width: '100%', height: 300, border: 0 }}
      />
    </Modal>
  )
}
export default ProcessActivityPngCmp
