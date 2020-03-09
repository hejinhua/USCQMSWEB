import { Component } from 'react'
import PropertyForm from './PropertyForm'
import { Tabs } from 'antd'

import styles from '../engine.css'
const TabPane = Tabs.TabPane

/**
 * @desc 属性表单高阶组件
 * @param engine
 * @returns {function(*)}
 * @constructor
 */
const PropertiesHoc = engine => WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props)
      const { peptidePageList } = engine
      this.state = {
        activeKey: peptidePageList[0] && peptidePageList[0].id
      }
      const { getInstance } = props
      if (getInstance && typeof getInstance === 'function') {
        getInstance(this)
      }
    }
    componentDidMount() {
      const { peptidePageList } = engine
      peptidePageList.forEach((item, index) => {
        if (index) {
          setTimeout(() => {
            this.onChange(item.id)
          }, 1)
        }
      })
      setTimeout(() => {
        this.onChange(peptidePageList[0].id)
      }, 1)
    }
    onOk = (e, confirm) => {
      const { peptidePageList } = engine
      const result = {}
      let isError = true
      peptidePageList.forEach((item, index) => {
        isError = this[`childForm${index}`] ? true : false
        this[`childForm${index}`] &&
          this[`childForm${index}`].Ok(e, value => {
            const { data: newData, file: newFile } = value
            const { data, file } = result
            result.data = { ...data, ...newData }
            result.file = file || newFile
            isError = false
          })
      })
      if (!isError) confirm(result)
    }
    onChange = key => {
      this.setState({ activeKey: key })
    }
    render() {
      const { propertyType, peptide, peptidePageList } = engine
      const { model } = this.props
      let cmp = null
      if (propertyType === 'itemRelationPage') {
        const {
          itemRelationPropertyPage: { pageFieldList, columns }
        } = engine || engine.modelRelationShip
        const record = model && model.selectedRows ? model.selectedRows[0] : {}
        cmp = <PropertyForm columns={columns} pageFieldList={pageFieldList} showBtn={false} record={record} />
      } else if (propertyType === 'itemPropertyPage') {
        if (peptide) {
          cmp = (
            <Tabs activeKey={this.state.activeKey} onChange={this.onChange}>
              {peptidePageList.map((item, index) => (
                <TabPane className='tab_pane' tab={item.name} key={item.id}>
                  <PropertyForm
                    wrappedComponentRef={form => (this[`childForm${index}`] = form)}
                    engine={engine}
                    {...engine}
                    pageFieldList={item.pageFieldList}
                    record={model.record}
                    {...this.props}
                  />
                </TabPane>
              ))}
            </Tabs>
          )
        } else {
          cmp = <PropertyForm engine={engine} {...engine} record={model.record} {...this.props} />
        }
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
