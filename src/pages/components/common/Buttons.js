import React from 'react'
import { Button } from 'antd'
import styles from './Buttons.less'
import { showConfirm } from '../../../utils/utils'

export const ConfirmButton = obj => {
  const { name, onClick, title, okText, cancelText, ...rest } = obj
  return (
    <Button
      className={styles.confirm}
      {...rest}
      onClick={() => {
        showConfirm(onClick, title, okText, cancelText)
      }}
      size='small'
    >
      {name}
    </Button>
  )
}

export const PreviewButton = obj => (
  <Button className={styles.open} id={obj.id} onClick={obj.onClick} size='small'>
    预览
  </Button>
)
export const EditButton = obj => (
  <Button className={styles.edit} id={obj.id} onClick={obj.onClick} icon='edit' size='small'>
    修改
  </Button>
)
export const DeleteButton = obj => (
  <Button className={styles.delete} id={obj.id} onClick={obj.onClick} icon='delete' size='small'>
    删除
  </Button>
)

export const AddButton = obj => (
  <Button className={styles.add} id={obj.id} onClick={obj.onClick} icon='plus-circle-o'>
    添加
  </Button>
)
/*刷新按钮*/
export const RefreshButton = obj => (
  <Button className={styles.refresh} id={obj.id} onClick={obj.onClick} disabled={obj.disabled} icon='sync'>
    刷新
  </Button>
)

export const DownButton = obj => (
  <Button className={styles.download} id={obj.id} onClick={obj.onClick} size='small'>
    下载
  </Button>
)
