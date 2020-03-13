import React, { Component } from 'react'
import { Button, Tooltip, Row, Col } from 'antd'
import { Search } from '../../common/Searchs'
import { clickBtn } from '../../../../utils/buttonFunc'
import PropertyForm from '../property/PropertyForm'
import AutoSizer from 'react-virtualized-auto-sizer'

import styles from '../engine.css'

/**
 * @desc 按钮高阶组件
 * @param engine
 * @returns {function(*)}
 * @constructor
 */
const ButtonHoc = engine => WrappedComponent => {
  return class extends Component {
    state = { showSearch: false }
    // componentDidUpdate(prevProps) {
    //   if (this.props !== prevProps) this.setState({ showSearch: false })
    // }
    toogle = () => {
      this.setState({ showSearch: !this.state.showSearch })
    }
    reset = () => {
      if (this.childForm) {
        this.childForm.props.form.resetFields()
      }
    }
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
        dispatch({ type: 'common/search', payload: { engine, page, model, queryWord } })
      }
    }

    advancedSearch = e => {
      if (this.childForm) {
        this.childForm.Ok(e, value => {
          console.log(value)
          this.props.dispatch({ type: 'common/advancedSearch', payload: { engine, page: 1, queryWord: value.data } })
        })
      }
    }

    render() {
      let cmp = null
      let supQuery = 0
      const { modelRelationShip, modelQueryView, modelClassView, pageMenus, itemSuppertQueryFields } = engine || {}
      if (engine) {
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
          {this.state.showSearch && (
            <Row className={styles.advancedSearch}>
              <AutoSizer style={{ width: '100%', height: '100%' }}>
                {({ width }) => (
                  <PropertyForm
                    columns={width / 400 >= 1 ? width / 400 : 1}
                    advancedSearch={true}
                    pageFieldList={itemSuppertQueryFields}
                    wrappedComponentRef={form => (this.childForm = form)}
                  />
                )}
              </AutoSizer>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type='primary' htmlType='submit' onClick={this.advancedSearch}>
                  搜索
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                  清空
                </Button>
              </Col>
            </Row>
          )}
          <div className={styles.flexX}>
            {cmp}
            {supQuery === 1 && (
              <div className={styles.search}>
                <Search onSearch={this.onSearch} onChange={this.props.onChange} />
              </div>
            )}
            {itemSuppertQueryFields && supQuery === 1 && (
              <Tooltip title='高级搜索'>
                <Button type='primary' icon='file-search' className='other_btn' onClick={this.toogle} />
              </Tooltip>
            )}
          </div>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }
}
export default ButtonHoc
