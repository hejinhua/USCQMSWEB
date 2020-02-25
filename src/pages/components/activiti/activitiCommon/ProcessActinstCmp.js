/**
 * @author lwp
 */
import React, { Component } from 'react'
import { Table, Col, Row, Card, Modal, Button } from 'antd/lib/index'
import Engine from '../../engine/Engine'
import { generatorModel } from '../../../../utils/modelGenarator'
import { Search } from '../../common/Searchs'

class ProcessActinstCmp extends Component {
  render() {
    const {
      visible,
      onCancel,
      processColumns,
      engine,
      list,
      processReverseList,
      title,
      isShowButtons,
      agree,
      reject,
      processInstanceId,
      showUsers,
      userVisible,
      toogleUser,
      userTreeList,
      selectChange,
      selectedRowKey,
      onOk,
      expandedRowKeys,
      onExpandedRowsChange,
      onSearchUser
    } = this.props
    const columns = [
      {
        title: '名称',
        dataIndex: 'name'
      }
    ]
    const namespace = 'activiti'
    engine.condition = `dsno = ${processInstanceId}`
    engine.namespace = namespace
    engine.facetype = engine.faceType
    delete engine.faceType
    const model = generatorModel(namespace)
    //判断是否已注册model
    let result = window.g_app._models.some(model => model.namespace === namespace)
    //没有注册，则注册model
    if (!result) {
      window.g_app.model(model)
      console.log(window.g_app._models)
    }
    this.props.dispatch({
      type: `${namespace}/packet`,
      payload: { dataList: list }
    })
    const Act = Engine(engine)
    return (
      <div>
        <Modal
          title={title}
          width={'80%'}
          onCancel={onCancel}
          destroyOnClose='true'
          visible={visible}
          footer={null}
          centered={true}
          mask={false}
          maskClosable={false}
          height={'calc(100vh - 92px)'}
        >
          <div>
            <Row>
              <Col>
                <Card title='详情' bordered={false}>
                  <div style={{ height: 500 }}>
                    <Act />
                  </div>
                </Card>
              </Col>
            </Row>
            {isShowButtons ? (
              <div style={{ textAlign: 'center' }}>
                <Button
                  style={{ marginLeft: 5, backgroundColor: '#3ca2e0', color: '#FFFFFF' }}
                  size='large'
                  onClick={() => agree()}
                >
                  办理
                </Button>
                <Button
                  style={{ marginLeft: 5, backgroundColor: '#de6764', color: '#FFFFFF' }}
                  size='large'
                  onClick={() => reject()}
                >
                  驳回
                </Button>
                <Button
                  style={{ marginLeft: 5, backgroundColor: '#5BA276', color: '#FFFFFF' }}
                  size='large'
                  onClick={() => showUsers()}
                >
                  移交
                </Button>
              </div>
            ) : null}
            <Row>
              <Col>
                <Card title='流转信息' bordered={false}>
                  <Table size='small' columns={processColumns} bordered={true} dataSource={processReverseList} />
                </Card>
              </Col>
            </Row>
          </div>
        </Modal>
        <Modal
          width={650}
          title={'用户选择器'}
          visible={userVisible}
          onCancel={toogleUser}
          okText={'转办'}
          onOk={onOk}
          height={'calc(100vh - 92px)'}
        >
          <div style={{ width: '100%', height: '34px' }}>
            <Search width='100%' onSearch={onSearchUser} />
          </div>
          <Table
            size='small'
            bordered
            columns={columns}
            dataSource={userTreeList}
            pagination={false}
            style={{ height: 400 }}
            scroll={{ y: 350 }}
            expandedRowKeys={expandedRowKeys}
            onExpandedRowsChange={onExpandedRowsChange}
            rowSelection={{
              type: 'radio',
              onChange: selectChange,
              selectedRowKeys: selectedRowKey,
              getCheckboxProps: record => ({
                disabled: !record.hasOwnProperty('password'),
                name: record.name
              })
            }}
          />
        </Modal>
      </div>
    )
  }
}
export default ProcessActinstCmp
