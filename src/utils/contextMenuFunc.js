import ContextMenu from '../pages/components/common/scrollTable/ContextMenu'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import * as commonService from '../pages/service/commonService'

export const showContextMenu = ({ model, engine, left, top, hData, itemNo }) => {
  const { itemMenus } = engine
  commonService
    .common({
      implclass: 'com.usc.app.action.mate.MenuEnableAuthAction',
      itemNo: itemNo || engine.itemNo,
      hData,
      otherParam: itemMenus
    })
    .then(res => {
      if (res && res.data) {
        const menus = res.data.dataList
        let div = document.getElementById('context-menu')
        if (!div) {
          const root = document.getElementById('root')
          div = document.createElement('div')
          div.setAttribute('id', 'context-menu')
          root.appendChild(div)
        }
        div.setAttribute('style', `position: fixed; left: ${left}px; top: ${top}px; z-index: 3000`)
        ReactDOM.render(
          <Provider store={window.g_app._store}>
            <ContextMenu menus={menus} model={model} engine={engine} left={left} top={top} />
          </Provider>,
          div
        )
      }
    })
}

export const hideContextMenu = () => {
  const menuDom = document.getElementById('context-menu')
  if (menuDom) ReactDOM.unmountComponentAtNode(menuDom)
}
