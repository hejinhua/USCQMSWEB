import React from 'react'
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon'
import 'ant-design-pro/dist/ant-design-pro.css' // 统一pro引入样式
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import DragModal from '../common/DragModal'
import NoticePng from '../../../assets/notice.png'
// import NewsPng from '../../../assets/news.png'
import TodoPng from '../../../assets/todo.png'
import NewsIcon from '../../../assets/NewsIcon.png'

const NoticeCmp = ({ dispatch, allList, toDoList, theme, popupVisible, NoticeModelCmp, noticeVisible }) => {
  let data = [...toDoList].concat(...allList)
  /**
   * 点击事件
   * @param item 数据详情
   */
  const handle = () => {
    dispatch({ type: 'notice/handle' })
  }
  const markedRead = () => {
    dispatch({ type: 'notice/markedRead', payload: { data } })
  }

  const onItemClick = item => {
    switch (item.TYPE) {
      case 'notice':
        dispatch({ type: 'notice/handle' })
        dispatch({ type: 'notice/getNoticeModal', payload: { type: item.TYPE } })
        break
      case 'todo':
        dispatch({ type: 'tab/addRouterTab', payload: { NAME: '待办任务', ICON: 'fund', NO: 'demo' } })
        dispatch({ type: 'demo/queryToDo', payload: { id: item.ID } })
        dispatch({ type: 'demo/getNoticeRelationTab', payload: { selectedRowKey: item.ID, selectedRow: item } })
        dispatch({ type: 'notice/edit', payload: { selectedRowKey: item.ID, data: data } })
        break
      case 'actToDo':
        dispatch({ type: 'tab/addRouterTab', payload: { NAME: '待办任务', ICON: 'setting', NO: 'actTaskToDo' } })
        dispatch({ type: 'actTaskToDo/queryAct' })
        dispatch({ type: 'notice/edit', payload: { selectedRowKey: item.ID, data: data } })
        break
      default:
        break
    }
    dispatch({ type: 'notice/onPopupVisibleChange' })
  }
  const onPopupVisibleChange = () => {
    dispatch({ type: 'notice/onPopupVisibleChange' })
  }
  const onViewMore = () => {}
  const onClear = () => {}

  function getNoticeData(notices) {
    if (notices.length === 0) {
      return {}
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice }
      if (newNotice.CTIME) {
        newNotice.datetime = moment(notice.CTIME).fromNow()
      }
      // transform id to item key
      if (newNotice.ID) {
        newNotice.key = newNotice.ID
      }
      if (newNotice.TITLE) {
        newNotice.title = newNotice.TITLE
      }
      if (newNotice.SMESSAGE) {
        newNotice.description = newNotice.SMESSAGE
      }
      newNotice.avatar = NewsIcon
      return newNotice
    })
    return groupBy(newNotices, 'TYPE')
  }

  const noticeData = getNoticeData(data)
  return (
    <div style={{ display: 'inline', color: theme ? '#fff' : '#000' }}>
      <NoticeIcon
        className='notice-icon'
        count={data.length}
        onItemClick={onItemClick}
        onClear={onClear}
        onViewMore={onViewMore}
        popupVisible={popupVisible}
        onPopupVisibleChange={onPopupVisibleChange}
      >
        <NoticeIcon.Tab
          showClear={false}
          list={noticeData['notice']}
          title='消息通知'
          emptyText='你已查看所有通知'
          emptyImage={NoticePng}
        />
        <NoticeIcon.Tab
          showClear={false}
          list={noticeData['todo']}
          title='任务待办'
          emptyText='你已完成所有待办'
          emptyImage={TodoPng}
        />
        <NoticeIcon.Tab
          showClear={false}
          list={noticeData['actToDo']}
          title='工作流待办'
          emptyText='你已完成所有待办'
          emptyImage={TodoPng}
        />
      </NoticeIcon>
      <DragModal
        width={'80%'}
        height={'80%'}
        title='消息通知'
        visible={noticeVisible}
        okText='标记已读'
        onOk={markedRead}
        onCancel={handle}
      >
        <div style={{ height: 400 }}>
          <NoticeModelCmp />
        </div>
      </DragModal>
    </div>
  )
}

export default NoticeCmp

// 数据结构
// {
//   id: '000000001',
//   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
//   title: '你收到了 14 份新周报',
//   datetime: '2017-08-09',
//   type: 'notice'
// },
// {
//   id: '000000002',
//     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
//   title: '你推荐的 曲妮妮 已通过第三轮面试',
//   datetime: '2017-08-08',
//   type: 'notice'
// },
// {
//   id: '000000003',
//   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
//   title: '这种模板可以区分多种通知类型',
//   datetime: '2017-08-07',
//   read: true,
//   type: 'notice'
// },
// {
//   id: '000000004',
//   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
//   title: '左侧图标用于区分不同的类型',
//   datetime: '2017-08-07',
//   type: 'notice'
// },
// {
//   id: '000000005',
//   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
//   title: '内容不要超过两行字，超出时自动截断',
//   datetime: '2017-08-07',
//   type: 'notice'
// },
// {
//   id: '000000006',
//   vatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
//   title: '曲丽丽 评论了你',
//   description: '描述信息描述信息描述信息',
//   datetime: '2017-08-07',
//   type: 'news',
//   clickClose: true
// },
// {
//   id: '000000007',
//   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
//   title: '朱偏右 回复了你',
//   description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
//   datetime: '2017-08-07',
//   type: 'news',
//   clickClose: true
// },
// {
//   id: '000000008',
//     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
//   title: '标题',
//   description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
//   datetime: '2017-08-07',
//   type: 'news',
//   clickClose: true
// },
// {
//   id: '000000009',
//     title: '任务名称',
//   description: '任务需要在 2017-01-12 20:00 前启动',
//   extra: '未开始',
//   status: 'todo',
//   type: 'todo'
// },
// {
//   id: '000000010',
//     title: '第三方紧急代码变更',
//   description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
//   extra: '马上到期',
//   status: 'urgent',
//   type: 'todo'
// },
// {
//   id: '000000011',
//     title: '信息安全考试',
//   description: '指派竹尔于 2017-01-09 前完成更新并发布',
//   extra: '已耗时 8 天',
//   status: 'doing',
//   type: 'todo'
// },
// {
//   id: '000000012',
//     title: 'ABCD 版本发布',
//   description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
//   extra: '进行中',
//   status: 'processing',
//   type: 'todo'
// }
