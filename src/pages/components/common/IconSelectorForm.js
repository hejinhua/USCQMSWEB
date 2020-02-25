import React, { useState, Fragment, useEffect } from 'react'
import Modal from './DragModal'
import { Search } from './Searchs'
import { message, Icon, Input, Button, Tooltip } from 'antd'

import { iconNames } from '../../../utils/iconNames'
import styles from './common.less'

const IconSelectorForm = ({ onOk, icon }) => {
  const [value, setValue] = useState('')
  const [visible, setVisible] = useState(false)
  const [iconMap, setIconMap] = useState(iconNames)

  useEffect(() => {
    setValue(icon)
  }, [icon])

  const Ok = () => {
    if (value) {
      onOk(value)
      setVisible(!visible)
    } else {
      message.warning('请选择数据')
    }
  }

  const onClick = item => () => {
    setValue(item)
  }

  const onSearch = queryWord => {
    if (queryWord) {
      let newMap = []
      iconNames.forEach(item => {
        const { title, names } = item
        let arr = []
        names.forEach(name => {
          if (name.indexOf(queryWord) !== -1) {
            arr.push(name)
          }
        })
        if (arr.length > 0) newMap.push({ title, names: arr })
      })
      setIconMap(newMap)
    } else {
      setIconMap(iconNames)
    }
  }

  const toogleModal = () => {
    setVisible(!visible)
  }

  const onChange = e => {
    setValue(e.target.value)
    onOk(e.target.value)
  }

  return (
    <Fragment>
      <Input value={value} onChange={onChange} addonAfter={<Icon type='plus' onClick={toogleModal} />} />
      <Modal width={650} title='选择图标' visible={visible} onCancel={toogleModal} onOk={Ok}>
        <Search onSearch={onSearch} />
        <div className={styles.iconPart}>
          {iconMap.map(item => (
            <Fragment key={item.title}>
              <p style={{ margin: '5px 0 2px 0' }}>{item.title}</p>
              <div className={styles.icon}>
                {item.names.map(item => (
                  <Tooltip title={item} key={item}>
                    <Button icon={item} style={{ margin: '2px' }} onClick={onClick(item)} />
                  </Tooltip>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </Modal>
    </Fragment>
  )
}

export default IconSelectorForm
