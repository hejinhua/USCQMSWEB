import React from 'react'
import styles from './index.css'
import { Layout, ConfigProvider } from 'antd'
import LeftMenu from '../pages/components/menu/LeftMenu'
import Tab from '../pages/routes/tab/tab'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import Login from '../pages/components/login/login'
import Authornized from '../pages/components/common/Authornized'
import WebSocket from './webSocket'
import Header from '../pages/components/menu/Header'
import DataPacket from './DataPacket'

moment.locale('zh-cn')
const { Content } = Layout

const BasicLayout = ({ location }) => {
  const Index = () => {
    return (
      <ConfigProvider locale={zh_CN}>
        <Layout className={styles.layout}>
          <Header />
          <Layout>
            <LeftMenu />
            <Content id='content' className={styles.layout_content_div}>
              <Tab />
            </Content>
            <DataPacket />
          </Layout>
        </Layout>
        <WebSocket />
      </ConfigProvider>
    )
  }
  const AuthornizedCmp = Authornized()(Index)
  switch (location.pathname) {
    case '/login':
      return <Login />
    default:
      return <AuthornizedCmp />
  }
}

export default BasicLayout
