import {
  pluginLoader,
  controllerLoader,
  middlewareLoader
} from './environment';
import { dynamicChartLoader } from './hook-chart';

const middlewareInit = async (_api, pageInfo) => {
  middleware[pageInfo.loadIndex]
    ? await middleware[pageInfo.loadIndex](_api)
    : false;
};

const pageLoader = async function (_api, pageInfo) {
  pageInfo.loadIndex = configuration.katharos.pageActions.loadIndex;
  await pluginLoader(_api, pageInfo);
  await controllerLoader(_api, pageInfo);
  await middlewareLoader(_api, pageInfo);
  await middlewareInit(_api, pageInfo);
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
    componentId: _api.system.getComponentId(navigationBar),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });

  //Generate Page Body
  document.getElementById('content').innerHTML += systemComponents.loader.html;

  _api.system.data.componentLib.pageLoader = {};
  _api.system.data.componentLib.pageLoader.status = true;
  _api.system.data.componentLib.pageLoader.id = uuid();

  _api.addEvent('loadComponent', {
    componentId: _api.system.data.componentLib.pageLoader.id,
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });

  //Generate Page Footer
  document.getElementById('content').innerHTML += systemComponents.footer.html;

  _api.system.data.componentLib.footer = {};
  _api.system.data.componentLib.footer.status = true;
  _api.system.data.componentLib.footer.id = uuid();

  _api.addEvent('loadComponent', {
    componentId: _api.system.data.componentLib.footer.id,
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });
};

export { pageLoader, pageReloader, dynamicChartLoader, componentLoader };
