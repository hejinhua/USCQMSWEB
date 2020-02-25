import React from 'react'
import { Card } from 'antd'
import Engine from '../engine/Engine'
import { judgeModel } from '../../../utils/utils'

class TabsCard extends React.Component {
  state = { noTitleKey: '', tabListNoTitle: [], contentListNoTitle: [] }

  componentWillReceiveProps(nextProps) {
    const tabListNoTitle = []
    const contentListNoTitle = {}
    nextProps.relationTabs.forEach(i => {
      const obj = {}
      obj.key = i.itemName
      obj.tab = i.itemName
      tabListNoTitle.push(obj)
      let engine = i
      const namespace = i.itemNo + '_' + nextProps.selectedRowKey
      engine.namespace = namespace
      engine.menuId = nextProps.selectedRowKey
      engine.facetype = engine.faceType
      judgeModel(namespace)
      nextProps.dispatch({
        type: 'tabsCard/NoticeTabsCardPacket',
        payload: { namespace: namespace, selectedRowKey: nextProps.selectedRowKey, itemNo: i.itemNo }
        // type: `${namespace}/packet`,
        // payload: { dataList: [], selectedRowKeys: [], selectedRows: [] }
      })
      const Cmp = Engine(engine)
      contentListNoTitle[i.itemName] = <Cmp />
    })
    this.setState({ noTitleKey: tabListNoTitle[0] ? tabListNoTitle[0].key : '' })
    this.setState({ tabListNoTitle: tabListNoTitle })
    this.setState({ contentListNoTitle: contentListNoTitle })
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key })
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <Card
          style={{ width: '100%', height: '100%' }}
          bodyStyle={{ height: 'calc(100% - 42px)', boxSizing: 'border-box', padding: 0 }}
          tabList={this.state.tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={key => {
            this.onTabChange(key, 'noTitleKey')
          }}
        >
          {this.state.contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    )
  }
}

export default TabsCard
