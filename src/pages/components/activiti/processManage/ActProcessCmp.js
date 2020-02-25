/**
 * @author lwp
 */
import React from 'react'
import { Modal, Select } from 'antd/lib/index'
// import ConfigInfo from '../../../routes/pageConfig/upDownLayOut/configInfo'

const { Option } = Select
const ActProcessCmp = ({
  onCancel,
  visible,
  onMouseEnter,
  itemNoList,
  handleChange,
  // list,
  // grid,
  // menu,
  // property,
  onOk
}) => {
  const options = itemNoList => {
    itemNoList = itemNoList.filter(
      item => item.request_uri !== null && item.request_uri !== '' && item.itemno !== null && item.itemno !== ''
    )
    let result = []
    if (itemNoList) {
      itemNoList.map(item => {
        result.push(
          <Option key={item.id} value={item.itemno}>
            {item.name}
          </Option>
        )
      })
    }
    return result
  }

  return (
    <Modal
      title='发起流程'
      width={1000}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose='true'
      visible={visible}
      centered={true}
      okText={'提交'}
      mask={false}
      maskClosable={false}
    >
      <Select
        onMouseEnter={onMouseEnter}
        labelInValue
        placeholder='请选择对象'
        style={{ width: 200, marginBottom: 10 }}
        onChange={handleChange}
      >
        {options(itemNoList)}
      </Select>
      {/*<ConfigInfo glList={list} glGrid={grid} glMenu={menu} glProperty={property} />*/}
    </Modal>
  )
}
export default ActProcessCmp
