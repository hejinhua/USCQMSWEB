import React, { Component } from 'react'
import { Card, Avatar, Breadcrumb, Icon } from 'antd'
import { connect } from 'dva'

import styles from './home.css'

const { Meta } = Card

class Test extends Component {
  state = { PID: '1', breadcrumb: [{ NAME: 'home', ICON: 'home', ID: '1' }] }

  clickCard = item => () => {
    const { menuData } = this.props
    const isFinal = menuData.some(menu => menu.PID === item.ID)
    if (isFinal) {
      const { ID, NAME, ICON } = item
      const { breadcrumb } = this.state
      breadcrumb.push({ NAME, ICON, ID })
      this.setState({ PID: ID, breadcrumb })
    } else {
      this.queryMeta(item)
    }
  }

  clickBreadcrumb = (ID, index) => () => {
    const { breadcrumb } = this.state
    this.setState({ PID: ID, breadcrumb: breadcrumb.slice(0, index + 1) })
  }

  queryMeta = item => {
    const { dispatch } = this.props
    dispatch({ type: 'tab/queryMeta', payload: { item } })
  }

  render() {
    const { PID, breadcrumb } = this.state
    const { menuData } = this.props
    return (
      <div className={styles.home_layout}>
        <Breadcrumb className={styles.home_breadcrumb}>
          {breadcrumb &&
            breadcrumb.map((item, index) =>
              index < breadcrumb.length - 1 ? (
                <Breadcrumb.Item
                  onClick={this.clickBreadcrumb(item.ID, index)}
                  className={styles.home_href}
                  key={item.ID}
                >
                  {item.ICON && <Icon type={item.ICON} />}
                  <span>{item.NAME}</span>
                </Breadcrumb.Item>
              ) : (
                <Breadcrumb.Item key={item.ID}>
                  {item.ICON && <Icon type={item.ICON} />}
                  <span>{item.NAME}</span>
                </Breadcrumb.Item>
              )
            )}
        </Breadcrumb>
        {menuData &&
          menuData.map(
            item =>
              item.PID === PID && (
                <Card
                  onClick={this.clickCard(item)}
                  className={styles.home_card}
                  size='small'
                  hoverable
                  style={{ width: 200 }}
                  key={item.ID}
                >
                  <Meta
                    avatar={<Avatar icon={item.ICON} style={{ backgroundColor: '#1890ff' }} />}
                    title={item.NAME}
                    description={item.NO}
                  />
                </Card>
              )
          )}
      </div>
    )
  }
}

function mapStateToProps({ menu }) {
  return { menuData: menu.menuData }
}

export default connect(mapStateToProps)(Test)
