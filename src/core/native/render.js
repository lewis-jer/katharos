import {
  pageLoader,
  pageReloader,
  dynamicChartLoader,
  componentLoader
} from './environment/index';
import { pageDestructor, dynamicTableDestructor } from './destructor';
import { _api } from '../api';

var includes = ['login', 'account_verify', 'eula', 'forgot_password'];
async function drawPage(pageName, pageInfo) {
  console.log('drawPage: ', this);
  console.log(pageInfo);

  var body = this.system.getView(pageInfo.arrayExpression).html;
  var navbarStatus = this.system.getComponentStatus('navigationBar');

  if (includes.includes(pageName)) {
    document.body.classList.add('bg-gradient-primary');
    this.system.componentLoader('navigationBar', false);
  } else if (!pageInfo.document && !navbarStatus) {
    await componentLoader.call(this, pageInfo);
  } else {
    document.querySelector('#loader').style.display = 'block';
  }

  document.getElementById(pageInfo.viewport).innerHTML = body;

  if (!pageInfo.document && pageInfo.dynamicCharts) {
    await dynamicChartLoader(this);
  }

  !pageInfo.loaded
    ? await pageLoader.call(this, pageInfo)
    : await pageReloader.call(this, pageInfo);

  let loaderStatus = !_api.loader.excludes.includes(pageName)
    ? await _api.loader.script(pageInfo.name)
    : 'Loader Not Initialized';

  history.replaceState(
    {},
    null,
    document.URL.slice(0, document.URL.lastIndexOf('/') + 1) + pageName
  );
}

export { dynamicTableDestructor, pageDestructor, drawPage };
