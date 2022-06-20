import {
  pageLoader,
  pageReloader,
  dynamicChartLoader,
  componentLoader
} from './environment/index';
import { pageDestructor, dynamicTableDestructor } from './destructor';

const drawPage = async function (pageName, pageInfo) {
  console.log('drawPage: ', this);
  var body = this.system.getView(pageInfo.arrayExpression).html;
  if (
    pageName == 'login' ||
    pageName == 'account_verify' ||
    pageName == 'eula' ||
    pageName == 'forgot_password'
  ) {
    document.body.classList.add('bg-gradient-primary');
    this.system.componentLoader('navigationBar', false);
  } else if (
    !pageInfo.document &&
    !this.system.getComponentStatus('navigationBar')
  ) {
    await componentLoader(this, pageInfo);
    let loaderStatus = !configuration.katharos.pageLoader.excludes.includes(
      pageName
    )
      ? await configuration.katharos.pageLoader.script(pageInfo.name)
      : 'Loader Not Initialized';
  }

  document.getElementById(pageInfo.viewport).innerHTML = body;

  if (!pageInfo.document && pageInfo.dynamicCharts) {
    await dynamicChartLoader(this);
  }

  if (!pageInfo.loaded) {
    await pageLoader(this, pageInfo);
  } else {
    await pageReloader(this, pageInfo);
  }

  history.replaceState(
    {},
    null,
    document.URL.slice(0, document.URL.lastIndexOf('/') + 1) + pageName
  );
};

export { dynamicTableDestructor, pageDestructor, drawPage };
