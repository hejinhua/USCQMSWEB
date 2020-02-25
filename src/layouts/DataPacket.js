import React from 'react'
import { Icon, message, Button } from 'antd'
import Database_setting from '../../public/sysPicture/database_setting.svg'
import Database_close from '../../public/sysPicture/database_close.svg'
import DragAndDrop from './DragAndDrop'
import * as commonService from '../pages/service/commonService'
import { generatorModel } from '../utils/modelGenarator'
import Engine from '../pages/components/engine/Engine'
import { connect } from 'dva'
import DragModal from '../pages/components/common/DragModal'

class DataPacket extends React.Component {
  state = {
    isDisplay: true,
    visible: false,
    title: '选择数据包',
    Cmp: () => <div />,
    SelectCmp: () => <div />
  }

  componentDidMount() {
    const values = {
      itemNo: 'DATAPACK',
      itemGridNo: 'default',
      itemPropertyNo: 'default',
      itemRelationPageNo: 'default',
      userName: localStorage.getItem('userName'),
      facetype: 1
    }
    commonService.post('/sysModelToWbeClient/getModelData', values).then(res => {
      if (res && res.data) {
        let engine = res.data
        const namespace = res.data.itemNo
        engine.namespace = namespace
        engine.facetype = engine.faceType
        delete engine.faceType
        const model = generatorModel(namespace)
        //判断是否已注册model
        let result = window.g_app._models.some(model => model.namespace === namespace)
        //没有注册，则注册model
        if (!result) {
          window.g_app.model(model)
        }
        const DataPacketCmp = Engine(engine)
        //选择数据包
        let engineSelect = JSON.parse(JSON.stringify(res.data))
        const namespaceSelect = res.data.itemNo + 'SELECT'
        engineSelect.namespace = namespaceSelect
        engineSelect.pageMenus = [
          {
            id: 'DataPacketSelectCmp',
            implclass: 'com.usc.app.activiti.action.GeneratePackage',
            name: '新建数据包',
            reqparam: 'itemNo;itemPropertyPageNo',
            wtype: 'confirm'
          }
        ]
        engineSelect.facetype = engineSelect.faceType
        delete engineSelect.faceType
        const modelSelect = generatorModel(namespaceSelect)
        //判断是否已注册model
        let resultSelect = window.g_app._models.some(model => model.namespace === namespaceSelect)
        //没有注册，则注册model
        if (!resultSelect) {
          window.g_app.model(modelSelect)
        }
        const DataPacketSelectCmp = Engine(engineSelect)
        this.setState({ Cmp: DataPacketCmp, SelectCmp: DataPacketSelectCmp })
      }
    })
  }

  showDataPacket = () => {
    if (sessionStorage.getItem('packet')) {
      this.props.dispatch({
        type: 'DATAPACK/packet',
        payload: {
          dataList: JSON.parse(sessionStorage.getItem('packet')),
          selectedRowKeys: [JSON.parse(sessionStorage.getItem('packet'))[0].ID],
          selectedRows: JSON.parse(sessionStorage.getItem('packet'))
        }
      })
      this.state.isDisplay = !this.state.isDisplay
      this.setState(this.state)
    } else {
      const values = {
        itemNo: 'DATAPACK',
        implclass: 'com.usc.app.query.QuerySingleItemData',
        itemGridNo: 'default',
        page: 1,
        condition: ` CUSER = '${localStorage.getItem('userName')}' AND ISNULL(PEOCESSEXAMPLEID)`
      }
      commonService.common(values).then(res => {
        if (res.data) {
          this.props.dispatch({
            type: 'DATAPACKSELECT/packet',
            payload: { dataList: res.data.dataList, selectedRowKeys: [], selectedRows: [] }
          })
        }
      })
      this.setState({ visible: true })
    }
  }

  toogleModal = () => {
    this.state.visible = !this.state.visible
    this.setState(this.state)
  }

  onOk = selectedRows => {
    if (selectedRows[0]) {
      if (selectedRows.length > 1) {
        message.error('请勿多选数据包')
      } else if ((selectedRows.length = 1)) {
        this.props.dispatch({
          type: 'DATAPACK/packet',
          payload: { dataList: selectedRows, selectedRowKeys: [selectedRows[0].ID], selectedRows: [selectedRows[0]] }
        })
        sessionStorage.setItem('packet', JSON.stringify(this.props.dataPack.selectedRows))
        this.setState({ visible: false })
      }
    } else {
      message.error('请选择数据包')
    }
  }

  Reselect = () => {
    const values = {
      itemNo: 'DATAPACK',
      implclass: 'com.usc.app.query.QuerySingleItemData',
      itemGridNo: 'default',
      page: 1,
      condition: ` CUSER = '${localStorage.getItem('userName')}' AND ISNULL(PEOCESSEXAMPLEID)`
    }
    commonService.common(values).then(res => {
      if (res.data) {
        this.props.dispatch({
          type: 'DATAPACKSELECT/packet',
          payload: { dataList: res.data.dataList, selectedRowKeys: [], selectedRows: [] }
        })
      }
    })
    this.state.visible = !this.state.visible
    this.setState(this.state)
  }

  openStartProcess = () => {
    this.props.dispatch({
      type: 'actStartProcess/query',
      payload: { selectedRows: JSON.parse(sessionStorage.getItem('packet')) }
    })
  }

  render() {
    const { isDisplay, Cmp, SelectCmp } = this.state
    return (
      <div>
        <DragAndDrop
          style={{ width: 60, height: 60 }}
          onMove={() => {}}
          // onMove={offet => {
          //   console.log('拖拽元素当前位置：', offet)
          // }}
        >
          <Icon
            onClick={this.showDataPacket}
            style={{ cursor: 'pointer', margin: 10 }}
            component={() =>
              this.state.visible || !this.state.isDisplay ? (
                <Database_close width={50} height={50} />
              ) : (
                <Database_setting width={50} height={50} />
              )
            }
          />
        </DragAndDrop>
        <div style={{ display: isDisplay ? 'none' : '' }}>
          <DragAndDrop
            style={{ width: 400, height: 180, border: '1px solid #f2f2f2', backgroundColor: '#FFFFFF' }}
            onMove={() => {}}
            needX={document.body.clientWidth - 400}
            needY={document.body.clientHeight / 4}
          >
            <div style={{ cursor: 'pointer', margin: 10, height: 110 }}>
              <Cmp />
            </div>
            <Button type={'primary'} onClick={this.Reselect} style={{ float: 'right', marginRight: 10 }}>
              重选数据包
            </Button>
            <Button type={'primary'} onClick={this.openStartProcess} style={{ float: 'left', marginLeft: 10 }}>
              选择流程启动
            </Button>
          </DragAndDrop>
        </div>
        <DragModal
          visible={this.state.visible}
          title={this.state.title}
          onCancel={this.toogleModal}
          onOk={() => this.onOk(this.props.dataPack.selectedRows)}
        >
          <div style={{ height: 280 }}>
            <SelectCmp />
          </div>
        </DragModal>
      </div>
    )
  }
}

const mapStateToProps = ({ DATAPACKSELECT }) => {
  return {
    dataPack: DATAPACKSELECT
  }
}

export default connect(mapStateToProps)(DataPacket)
