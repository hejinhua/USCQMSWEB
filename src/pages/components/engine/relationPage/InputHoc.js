/*
 * @Author: hjh
 * @Date: 2019-10-08 15:38:12
 * @LastEditTime : 2020-01-02 14:58:12
 * @Descripttion: 输入关联页高阶组件
 */

import { Component } from 'react'
import { Button, message } from 'antd'
import SelectItemNo from '../../tableConfig/SelectItemNo'
import SelectFileData from '../../task/SelectFileData'
import ScrollTable from '../../common/scrollTable/ScrollTable'
import Engine from '../Engine'
import DragModal from '../../common/DragModal'

import { showConfirm, judgeModel } from '../../../../utils/utils'
import * as commonService from '../../../service/commonService'

import styles from '../engine.css'

const columns = [
  {
    title: '名称',
    dataIndex: 'NAME',
    width: 300
  },
  {
    title: '代号',
    dataIndex: 'NO',
    width: 300
  },
  {
    title: '时间',
    dataIndex: 'ctime',
    width: 100
  }
]
const InputHoc = engine => WrappedComponent => {
  return class extends Component {
    state = { visible: false, data: [], visible2: false, ModalData: null }

    toogleItemNo = () => {
      this.props.dispatch({
        type: 'selectItemNo/query',
        payload: { condition: `SITEM=0 AND TYPE in (0, 1)`, onSelect: this.itemNoSelect }
      })
    }

    toogleFileData = () => {
      this.setState({ visible: !this.state.visible })
    }

    itemNoSelect = rows => {
      const { itemA, pRecord, namespace, rType } = engine
      rows.forEach(item => ((item.NO = item.itemno), (item.NAME = item.name)))
      const values = {
        itemNo: rType === 'input' ? 'TASKINPUT' : 'TASKOUTPUT',
        itemA,
        itemAData: pRecord,
        hData: rows,
        implclass:
          rType === 'input'
            ? 'com.usc.app.action.task.AddTaskInputItemsAction'
            : 'com.usc.app.action.task.AddTaskOutputItemsAction'
      }
      this.props.dispatch({ type: 'common/save', payload: { values, namespace } })
      this.toogleItemNo()
    }

    FileDataSelect = rows => {
      const { itemA, pRecord, namespace, rType } = engine
      const { selectedRows } = this.props.model
      rows.forEach(item => {
        const { no, name, id } = item
        item.pid = selectedRows[0].id
        item.NO = no
        item.NAME = name
        item.OBJECTID = id
      })
      const values = {
        itemNo: rType === 'input' ? 'TASKINPUT' : 'TASKOUTPUT',
        itemA,
        itemAData: pRecord,
        hData: rows,
        implclass:
          rType === 'input'
            ? 'com.usc.app.action.task.AddTaskInputObjectsAction'
            : 'com.usc.app.action.task.AddTaskOutputObjectsAction'
      }
      this.props.dispatch({ type: 'common/save', payload: { values, namespace } })
      this.toogleFileData()
    }

    onChange = (selectedRowKeys, selectedRows) => {
      this.props.dispatch({
        type: `${engine.namespace}/packet`,
        payload: { selectedRowKeys, selectedRows }
      })
    }

    delFile = () => {
      const { selectedRows } = this.props.model
      if (selectedRows && selectedRows[0]) {
        showConfirm(() => {
          // del(selectedRows[0])
        })
      } else {
        message.warning('请选择表对象!')
      }
    }

    addFileData = () => {
      const { selectedRows } = this.props.model
      const { rType } = engine
      if (selectedRows && selectedRows[0]) {
        if (selectedRows[0].pid === '0') {
          this.props.dispatch({
            type: 'selectFileData/query',
            payload: {
              itemNo: selectedRows[0].ITEMNO,
              itemGridNo: 'default',
              condition: rType === 'output' ? `cuser = '${localStorage.getItem('userName')}'` : ''
            }
          })
          this.toogleFileData()
        } else {
          message.warning('请选择文件对象!')
        }
      } else {
        message.warning('请选择表对象!')
      }
    }

    viewData = () => {
      const { dispatch, model } = this.props
      const { ITEMNO, OBJECTID, PID, ID } = model.selectedRows[0]
      const params = {
        itemNo: ITEMNO,
        itemGridNo: 'default',
        itemRelationPageNo: 'default',
        facetype: 2
      }
      commonService.post('/sysModelToWbeClient/getModelData', params).then(res => {
        if (res.data) {
          const modalEngine = res.data
          const namespace = ITEMNO + '_viewData'
          modalEngine.namespace = namespace
          modalEngine.facetype = 2
          modalEngine.menuId = 'viewData'
          judgeModel(namespace)
          const params = {
            itemNo: ITEMNO,
            itemGridNo: 'default',
            page: 1,
            implclass: 'com.usc.app.query.QuerySingleItemData',
            condition:
              PID !== '0'
                ? `ID = '${OBJECTID}'`
                : `del=0 AND EXISTS(SELECT 1 FROM ${
                    engine.rType === 'input' ? 'TASK_INPUT' : 'TASK_OUTPUT'
                  } A WHERE A.del=0 AND A.pid='${ID}' AND A.objectid=${ITEMNO}.id)`
          }
          commonService.common(params).then(res => {
            if (res.data) {
              dispatch({
                type: `${namespace}/packet`,
                payload: { dataList: res.data.dataList, selectedRowKeys: [], selectedRows: [] }
              })
              const ModalData = Engine(modalEngine)
              this.setState({ ModalData, visible2: true })
            }
          })
        }
      })
    }

    toogleModal = () => {
      this.setState({ visible2: false })
    }

    render() {
      const { visible, visible2, ModalData } = this.state
      const { selectedRowKeys, dataList, selectedRows = [] } = this.props.model
      const {
        pRecord: { TSTATE, LEADER, EXECUTOR, cuser },
        rType
      } = engine
      let disabled1 = true
      let disabled2 = true
      const userName = localStorage.getItem('userName')
      if (
        rType === 'input' &&
        (TSTATE === '未下发' || TSTATE === '被拒绝') &&
        (userName === 'admin' || userName === LEADER)
      ) {
        disabled1 = false
        disabled2 = false
      } else if (rType === 'output') {
        if (TSTATE === '执行中' && userName === EXECUTOR) disabled2 = false
        if (TSTATE === '未下发' && (userName === LEADER || userName === cuser)) disabled1 = false
      }

      const rowSelection = {
        type: 'checkbox',
        onChange: this.onChange,
        selectedRowKeys
      }
      return (
        <div className={styles.flexY}>
          <div>
            <Button type='primary' onClick={this.toogleItemNo} icon='file-add' disabled={disabled1}>
              添加对象
            </Button>
            <Button type='primary' onClick={this.addFileData} className='other_btn' disabled={disabled2}>
              添加数据
            </Button>
            <Button type='primary' disabled={true} onClick={this.delFile} className='other_btn'>
              移除
            </Button>
            <Button type='primary' disabled={!selectedRows[0]} onClick={this.viewData} className='other_btn'>
              查看数据
            </Button>
          </div>
          <div className={styles.flexGrowY}>
            <ScrollTable list={dataList} columns={columns} isTree={true} rowSelection={rowSelection} />
          </div>
          <SelectItemNo />
          <SelectFileData visible={visible} toogleModal={this.toogleFileData} FileDataSelect={this.FileDataSelect} />
          <WrappedComponent {...this.props} />
          <DragModal
            width='80%'
            title='查看数据'
            visible={visible2}
            onOk={this.toogleModal}
            onCancel={this.toogleModal}
          >
            <div style={{ height: 550 }}>
              <ModalData />
            </div>
          </DragModal>
        </div>
      )
    }
  }
}

export default InputHoc
