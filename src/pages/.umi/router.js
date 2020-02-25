import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/service/commonService",
        "exact": true,
        "component": require('../service/commonService.js').default,
        "_title": "bsm_web_1.0",
        "_title_default": "bsm_web_1.0"
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default,
        "_title": "bsm_web_1.0",
        "_title_default": "bsm_web_1.0"
      },
      {
        "component": () => React.createElement(require('E:/job/2.1/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false }),
        "_title": "bsm_web_1.0",
        "_title_default": "bsm_web_1.0"
      }
    ],
    "_title": "bsm_web_1.0",
    "_title_default": "bsm_web_1.0"
  },
  {
    "component": () => React.createElement(require('E:/job/2.1/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false }),
    "_title": "bsm_web_1.0",
    "_title_default": "bsm_web_1.0"
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
