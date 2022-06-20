import {
  pageLoader,
  pageReloader,
  dynamicChartLoader,
  componentLoader
} from './environment/index';
import { pageDestructor, dynamicTableDestructor } from './destructor';

var includes = ['login', 'account_verify', 'eula', 'forgot_password'];
async function terminateLoader(pageName, pageInfo) {
  if (!this.loader.excludes.includes(pageName)) {
    await this.loader.script(pageInfo.name);
    document.getElementById(pageInfo.viewport).style.visibility = 'visible';
    return;
  } else {
    return 'Loader Not Initialized';
  }
}

async function buildPage(pageName, pageInfo) {
  var body = this.system.getView(pageInfo.arrayExpression).html;
  document.getElementById(pageInfo.viewport).innerHTML = body;
  !this.loader.excludes.includes(pageName) &&
    (document.getElementById(pageInfo.viewport).style.visibility = 'hidden');
}

async function drawPage(pageName, pageInfo) {
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

  await buildPage.call(this, pageName, pageInfo);

  !pageInfo.loaded
    ? await pageLoader.call(this, pageInfo)
    : await pageReloader.call(this, pageInfo);

  await this.timeout(1000);
  await terminateLoader.call(this, pageName, pageInfo);

  history.replaceState(
    {},
    null,
    document.URL.slice(0, document.URL.lastIndexOf('/') + 1) + pageName
  );
}

export { dynamicTableDestructor, pageDestructor, drawPage };
