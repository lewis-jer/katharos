import {
  pageLoader,
  pageReloader,
  dynamicChartLoader,
  componentLoader
} from './environment/index';
import { pageDestructor, dynamicTableDestructor } from './destructor';

const drawPage = async function (pageName, pageInfo, _api) {
  console.log(_api);
  var body = documents[pageInfo.arrayExpression].html;
  if (
    pageName == 'login' ||
    pageName == 'account_verify' ||
    pageName == 'eula'
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

  history.replaceState({}, null, window.domain + pageName);
};

export { dynamicTableDestructor, pageDestructor, drawPage };
