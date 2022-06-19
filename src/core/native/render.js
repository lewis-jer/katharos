import {
  pageLoader,
  pageReloader,
  dynamicChartLoader,
  componentLoader
} from './environment/index';
import { pageDestructor, dynamicTableDestructor } from './destructor';

const drawPage = async function (pageName, pageInfo, _api) {
  _api.system.getView();
  var body = _api.system.getView(pageInfo.arrayExpression).html;
  if (
    pageName == 'login' ||
    pageName == 'account_verify' ||
    pageName == 'eula' ||
    pageName == 'forgot_password'
  ) {
    document.body.classList.add('bg-gradient-primary');
    _api.system.componentLoader('navigationBar', false);
  } else if (
    !pageInfo.document &&
    !_api.system.getComponentStatus('navigationBar')
  ) {
    await componentLoader(_api, pageInfo);
    let loaderStatus = !configuration.katharos.pageLoader.excludes.includes(
      pageName
    )
      ? await configuration.katharos.pageLoader.script(pageInfo.name)
      : 'Loader Not Initialized';
  }

  document.getElementById(pageInfo.viewport).innerHTML = body;

  if (!pageInfo.document && pageInfo.dynamicCharts) {
    await dynamicChartLoader(_api);
  }

  if (!pageInfo.loaded) {
    await pageLoader(_api, pageInfo);
  } else {
    await pageReloader(_api, pageInfo);
  }

  history.replaceState(
    {},
    null,
    document.URL.slice(0, document.URL.lastIndexOf('/') + 1) + pageName
  );
};

export { dynamicTableDestructor, pageDestructor, drawPage };
