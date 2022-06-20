import {
  pageLoader,
  pageReloader,
  dynamicChartLoader,
  componentLoader
} from './environment/index';
import { pageDestructor, dynamicTableDestructor } from './destructor';
import { _api } from '../api';

var includes = ['login', 'account_verify', 'eula', 'forgot_password'];
async function terminateLoader(pageName, pageInfo) {
  if (!_api.loader.excludes.includes(pageName)) {
    await _api.loader.script(pageInfo.name);
    return;
  } else {
    return 'Loader Not Initialized';
  }
}

async function buildPage(pageName, pageInfo) {
  var body = this.system.getView(pageInfo.arrayExpression).html;
  await terminateLoader.call(this, null, pageInfo);
  document.getElementById(pageInfo.viewport).innerHTML = body;
}

async function drawPage(pageName, pageInfo) {
  console.log('drawPage: ', this);
  console.log(pageInfo);

  var navbarStatus = this.system.getComponentStatus('navigationBar');

  if (includes.includes(pageName)) {
    document.body.classList.add('bg-gradient-primary');
    this.system.componentLoader('navigationBar', false);
  } else if (!pageInfo.document && !navbarStatus) {
    await componentLoader.call(this, pageInfo);
  } else {
    document.querySelector('#loader').style.display = 'flex';
  }

  if (!pageInfo.document && pageInfo.dynamicCharts) {
    await dynamicChartLoader(this);
  }

  !pageInfo.loaded
    ? await pageLoader.call(this, pageInfo)
    : await pageReloader.call(this, pageInfo);

  await buildPage.call(this, null, pageInfo);

  history.replaceState(
    {},
    null,
    document.URL.slice(0, document.URL.lastIndexOf('/') + 1) + pageName
  );
}

export { dynamicTableDestructor, pageDestructor, drawPage };
