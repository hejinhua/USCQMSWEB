import React from 'react'
import { Row, Col, Table, Card, Checkbox } from 'antd'
import { generatorTableKey } from '../../../utils/utils'
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import TabsCard from './TabsCard'

const DemoCmp = ({ onRow, rowSelection, selectedRowKey, noticeList, relationTabs, dispatch }) => {
  //left
  noticeList = generatorTableKey(noticeList[0])
  const columns = [
    {
      title: '标题',
      dataIndex: 'TITLE',
      render(text, record) {
        return (
          <Ellipsis tooltip lines={1}>
            {record.TITLE}
          </Ellipsis>
        )
      }
    },
    {
      title: '内容',
      dataIndex: 'SMESSAGE',
      render(text, record) {
        return (
          <Ellipsis tooltip lines={1}>
            {record.SMESSAGE}
          </Ellipsis>
        )
      }
    },
    {
      title: '是否已读',
      dataIndex: 'STATUS',
      align: 'center',
      render: text => {
        return <Checkbox checked={text} />
      }
    }
  ]
  const pagination = {
    total: noticeList.length,
    pageSize: 30
  }
  return (
    <Row gutter={16} style={{ height: '100%' }}>
      <Col span={8}>
        <Card title='已读信息' bordered={false} bodyStyle={{ padding: 0 }}>
          <Table
            bordered
            position={pagination}
            onRow={onRow}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={noticeList}
          />
        </Card>
      </Col>
      <Col span={16} style={{ height: '100%' }}>
        <TabsCard relationTabs={relationTabs} selectedRowKey={selectedRowKey} dispatch={dispatch} />
      </Col>
    </Row>
  )
}

export default DemoCmp
