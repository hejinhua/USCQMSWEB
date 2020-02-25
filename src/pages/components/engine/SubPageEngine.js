/*
 * @Author: hjh
 * @Date: 2019-11-25 16:32:59
 * @LastEditTime : 2019-12-30 11:21:38
 * @Descripttion: 关联页engine
 */
import { connect } from 'dva'
import PropertyHoc from './property/PropertyHoc'
import AuthorityHoc from './relationPage/AuthorityHoc'
import ChangeHistoryHoc from './relationPage/ChangeHistoryHoc'
import InputHoc from './relationPage/InputHoc'
import Engine from './Engine'

export default function(engine) {
  const { namespace, rType, modelRelationShip, modelQueryView, modelClassView, supQuery } = engine
  let newEngine = { ...engine, ...modelRelationShip, ...modelQueryView, ...modelClassView, supQuery }
  const Basic = () => {
    return <div />
  }
  let OutComponent = Basic

  switch (rType) {
    case 'relationproperty':
      engine.propertyType = 'itemRelationPage'
      OutComponent = PropertyHoc(engine)(OutComponent)
      break
    case 'relationpage':
      // delete newEngine.modelRelationShip
      newEngine.facetype = modelRelationShip && modelRelationShip.itemRelationPage ? 2 : 1
      OutComponent = Engine(newEngine)
      // 直接返回，不用在包裹一层model，Engine方法里面会包裹
      return OutComponent
    case 'relationqueryview':
      // delete newEngine.modelQueryView
      newEngine.facetype = modelQueryView && modelQueryView.itemRelationPage ? 2 : 1
      OutComponent = Engine(newEngine)
      return OutComponent
    case 'relationclassview':
      newEngine.facetype = 5
      OutComponent = Engine(newEngine)
      return OutComponent
    case 'authority':
      OutComponent = AuthorityHoc(engine)(OutComponent)
      break
    case 'changeHistory':
      OutComponent = ChangeHistoryHoc(engine)(OutComponent)
      break
    case 'input':
    case 'output':
      OutComponent = InputHoc(engine)(OutComponent)
      break
    default:
      OutComponent = Engine(engine)
    // console.log('新的关联页类型：', rType)
  }

  function mapStateToProps(state) {
    return { model: state[namespace] }
  }
  return connect(mapStateToProps)(OutComponent)
}
