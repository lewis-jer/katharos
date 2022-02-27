import {
  pluginLoader,
  controllerLoader,
  middlewareLoader
} from './environment';
import { dynamicChartLoader } from './hook-chart';

const pageLoader = async function (_api, pageInfo) {
  pageInfo.loadIndex = pageActions.loadIndex;
  await pluginLoader(_api, pageInfo);
  await controllerLoader(_api, pageInfo);
  await middlewareLoader(_api, pageInfo);
  middleware[pageActions.loadIndex]
    ? middleware[pageActions.loadIndex](_api)
    : false;
  pageInfo.loaded = true;
  pageActions.loadIndex++;
};
const pageReloader = async function (_api, pageInfo) {
  middleware[pageInfo.loadIndex]
    ? await middleware[pageInfo.loadIndex]()
    : false;
};
const componentLoader = async function (_api, pageInfo) {
  var systemComponents = _api.arrayToObject(components.system);

  //Clear Page
  document.getElementById('wrapper').innerHTML = '';

  //Generate Page Navigation Bar
  document.getElementById('wrapper').innerHTML += systemComponents.navbar.html;

  componentLib.navigationBar.status = true;
  componentLib.navigationBar.id = uuid();

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
    componentId: componentLib.navigationBar.id,
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });

  //Generate Page Body
  document.getElementById('content').innerHTML += systemComponents.loader.html;

  componentLib.pageLoader = {};
  componentLib.pageLoader.status = true;
  componentLib.pageLoader.id = uuid();

  _api.addEvent('loadComponent', {
    componentId: componentLib.pageLoader.id,
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });

  //Generate Page Footer
  document.getElementById('content').innerHTML += systemComponents.footer.html;

  componentLib.footer = {};
  componentLib.footer.status = true;
  componentLib.footer.id = uuid();

  _api.addEvent('loadComponent', {
    componentId: componentLib.footer.id,
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });
};

export { pageLoader, pageReloader, dynamicChartLoader, componentLoader };
