import React, { Component } from 'react'
import { Button } from 'antd'
import { Search } from '../../common/Searchs'
import { clickBtn } from '../../../../utils/buttonFunc'

import styles from '../engine.css'

/**
 * @desc 按钮高阶组件
 * @param engine
 * @returns {function(*)}
 * @constructor
 */
const ButtonHoc = engine => WrappedComponent => {
  return class extends Component {
    onClick = item => {
      const { model } = this.props
      clickBtn(item, engine, model)
    }

    onSearch = queryWord => {
      const { dispatch, model } = this.props
      const { noSearch } = engine
      const page = 1
      queryWord = queryWord.trim()
      if (!noSearch) {
        dispatch({
          type: 'common/search',
          payload: { engine, page, model, queryWord }
        })
      }
    }

    render() {
      let cmp = null
      let supQuery = 0
      if (engine) {
        const { modelRelationShip, modelQueryView, modelClassView, pageMenus } = engine
        let model = modelRelationShip || modelQueryView || modelClassView
        let menuList = (model && model.relationMenuList) || pageMenus || []
        supQuery = engine.supQuery
        cmp = menuList.map(item => (
          <Button
            type='primary'
            className='other_btn'
            key={item.id}
            onClick={() => this.onClick(item)}
            disabled={item.disabled}
            icon={item.icon}
          >
            {item.name}
          </Button>
        ))
      }
      return (
        <div>
          <div className={styles.flexX}>
            {cmp}
            {supQuery === 1 && (
              <div className={styles.search}>
                <Search onSearch={this.onSearch} onChange={this.props.onChange} />
              </div>
            )}
          </div>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }
}
export default ButtonHoc
