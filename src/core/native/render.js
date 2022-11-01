import { pageLoader, pageReloader, dynamicChartLoader, componentLoader } from './environment/index';
import { pageDestructor, dynamicTableDestructor } from './destructor';

const loader = {
  script: async function (x) {
    await $(document).ready(function (event) {
      document.querySelector('#loader').style.display = 'none';
      analytics.page(x);
      $('#loaderDiv').fadeIn(750);
      $('#footer').fadeIn(750);
    });
    return 'Module Initialization';
  },
  selective: ['loginLoader'],
  excludes: ['r', 'login'],
  function: true
};

var includes = ['login', 'account_verify', 'eula', 'forgot_password', 'login_auth_basic'];
async function terminateLoader(pageName, pageInfo) {
  if (!loader.excludes.includes(pageName)) {
    await loader.script(pageInfo.name);
    console.log(this);
    document.getElementById(pageInfo.viewport).style.visibility = 'visible';
    return;
  } else {
    return 'Loader Not Initialized';
  }
}

async function buildPage(pageName, pageInfo) {
  var body = this.system.getView(pageInfo.arrayExpression).html;
  document.getElementById(pageInfo.viewport).innerHTML = body;
  !loader.excludes.includes(pageName) && (document.getElementById(pageInfo.viewport).style.visibility = 'hidden');
  console.log(this);
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
    await dynamicChartLoader.call(this);
  }

  await buildPage.call(this, pageName, pageInfo);

  !pageInfo.loaded ? await pageLoader.call(this, pageInfo) : await pageReloader.call(this, pageInfo);

  await this.timeout(1000);
  await terminateLoader.call(this, pageName, pageInfo);

  history.replaceState({}, null, document.URL.slice(0, document.URL.lastIndexOf('/') + 1) + pageName);
}

export { dynamicTableDestructor, pageDestructor, drawPage };
