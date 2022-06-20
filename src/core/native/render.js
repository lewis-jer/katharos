import {
  pageLoader,
  pageReloader,
  dynamicChartLoader,
  componentLoader
} from './environment/index';
import { pageDestructor, dynamicTableDestructor } from './destructor';

var includes = ['login', 'account_verify', 'eula', 'forgot_password'];
async function drawPage(pageName, pageInfo) {
  console.log('drawPage: ', this);
  console.log(pageInfo);
  var body = this.system.getView(pageInfo.arrayExpression).html;
  if (includes.includes(pageName)) {
    document.body.classList.add('bg-gradient-primary');
    this.system.componentLoader('navigationBar', false);
  } else if (
    !pageInfo.document &&
    !this.system.getComponentStatus('navigationBar')
  ) {
    let loaderStatus = !configuration.katharos.pageLoader.excludes.includes(
      pageName
    )
      ? await configuration.katharos.pageLoader.script(pageInfo.name)
      : 'Loader Not Initialized';
    await componentLoader.call(this, pageInfo);
  }

  document.getElementById(pageInfo.viewport).innerHTML = body;

  if (!pageInfo.document && pageInfo.dynamicCharts) {
    await dynamicChartLoader(this);
  }

  if (!pageInfo.loaded) {
    await pageLoader.call(this, pageInfo);
  } else {
    await pageReloader.call(this, pageInfo);
  }

  history.replaceState(
    {},
    null,
    document.URL.slice(0, document.URL.lastIndexOf('/') + 1) + pageName
  );
}

export { dynamicTableDestructor, pageDestructor, drawPage };
