import { connect } from 'dva'
import TableHoc from './table/TableHoc'
import ButtonHoc from './button/ButtonHoc'
import UpAndDownHoc from './layout/UpAndDownHoc'
import LeftAndRightHoc from './layout/LeftAndRightHoc'
import SingleHoc from './layout/SingleHoc'
import ClassRelationHoc from './layout/ClassRelationHoc'
import AutoClassHoc from './layout/AutoClassHoc'

/**
 * @desc 根据不同的engine数据，判断包裹不同的高阶组件
 * @param engine
 * @returns {*}
 */
export default function(engine) {
  const { namespace, facetype } = engine
  //预留基础组建，页面延伸可在此组件添加
  const Basic = () => <div />

  let OutComponent = Basic
  if (facetype !== 4) {
    OutComponent = ButtonHoc(engine)(OutComponent)
  }

  //包裹table
  if (engine.itemGrid) {
    OutComponent = TableHoc(engine)(OutComponent)
  }

  if (facetype === 1) {
    OutComponent = SingleHoc(engine)(OutComponent)
  } else if (facetype === 2 || facetype === 21) {
    if (engine.itemRelationPage) {
      OutComponent = UpAndDownHoc(engine)(OutComponent)
    }
  } else if (facetype === 3) {
    OutComponent = LeftAndRightHoc(engine)(OutComponent)
  } else if (facetype === 4) {
    OutComponent = ClassRelationHoc(engine)(OutComponent)
  } else if (facetype === 5) {
    if (engine.itemRelationPage) {
      OutComponent = UpAndDownHoc(engine)(OutComponent)
    }
    OutComponent = AutoClassHoc(engine)(OutComponent)
  }

  //根据页面数据engine传进来的唯一属性当作命名空间
  function mapStateToProps(state) {
    //此处namespace为命名空间，包裹的高阶组件中可以用该命名空间model数据
    return { model: state[namespace] }
  }
  return connect(mapStateToProps)(OutComponent)
}
