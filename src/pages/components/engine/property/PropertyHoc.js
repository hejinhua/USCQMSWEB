import { Component } from 'react'
import PropertyForm from './PropertyForm'

import styles from '../engine.css'

/**
 * @desc 属性表单高阶组件
 * @param engine
 * @returns {function(*)}
 * @constructor
 */
const PropertiesHoc = engine => WrappedComponent => {
  return class extends Component {
    render() {
      const { propertyType } = engine
      const { model } = this.props
      let cmp = null
      if (propertyType === 'itemRelationPage') {
        const {
          itemRelationPropertyPage: { pageFieldList, columns }
        } = engine || engine.modelRelationShip
        const record = model && model.selectedRows ? model.selectedRows[0] : {}
        cmp = <PropertyForm columns={columns} pageFieldList={pageFieldList} showBtn={false} record={record} />
      } else if (propertyType === 'itemPropertyPage') {
        cmp = <PropertyForm engine={engine} {...engine} record={model.record} {...this.props} />
      }
      return (
        <div
          style={{ overflow: propertyType === 'itemRelationPage' ? 'scroll' : 'visible' }}
          className={styles.authScroll}
        >
          {cmp}
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }
}

export default PropertiesHoc
