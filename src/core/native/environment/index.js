import {
  pluginLoader,
  controllerLoader,
  middlewareLoader
} from './environment';
import { dynamicChartLoader } from './hook-chart';

const middlewareInit = async (_api, pageInfo) => {
  middleware[pageInfo.loadIndex]
    ? await _api.system.getMiddleware(pageInfo.loadIndex)(_api)
    : false;
};

const pageLoader = async function (_api, pageInfo) {
  pageInfo.loadIndex = configuration.katharos.pageActions.loadIndex;
  await pluginLoader(_api, pageInfo);
  await controllerLoader(_api, pageInfo);
  await middlewareLoader(_api, pageInfo);
  _api.system.instantiateMiddleware(_api, pageInfo);
  //console.log(middlewareInit);
  //await middlewareInit(_api, pageInfo);
  pageInfo.loaded = true;
  configuration.katharos.pageActions.loadIndex++;
};
const pageReloader = async function (_api, pageInfo) {
  await middlewareInit(_api, pageInfo);
};
const componentLoader = async function (_api, pageInfo) {
  var systemComponents = _api.arrayToObject(components.system);

  //Clear Page
  document.getElementById('wrapper').innerHTML = '';

  //Generate Page Navigation Bar
  document.getElementById('wrapper').innerHTML += systemComponents.navbar.html;

  _api.system.componentLoader('navigationBar', true);

  _api.arrayToObject(modulePath)[
    _api.arrayToObject(components.system).navbar.arrayExpression
  ].loaded
    ? await pageReloader(
        _api,
        _api.arrayToObject(modulePath)[
          _api.arrayToObject(components.system).navbar.arrayExpression
        ]
      )
    : await pageLoader(
        _api,
        _api.arrayToObject(modulePath)[
          _api.arrayToObject(components.system).navbar.arrayExpression
        ]
      );

  _api.addEvent('loadComponent', {
    componentId: _api.system.getComponentId('navigationBar'),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });

  //Generate Page Body
  document.getElementById('content').innerHTML += systemComponents.loader.html;

  _api.system.componentLoader('pageLoader', true);

  _api.addEvent('loadComponent', {
    componentId: _api.system.getComponentId('pageLoader'),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });

  //Generate Page Footer
  document.getElementById('content').innerHTML += systemComponents.footer.html;

  _api.system.componentLoader('footer', true);

  _api.addEvent('loadComponent', {
    componentId: _api.system.getComponentId('footer'),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });
};

export { pageLoader, pageReloader, dynamicChartLoader, componentLoader };
