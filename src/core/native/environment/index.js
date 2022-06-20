import { dynamicChartLoader } from './hook-chart';

async function pageLoader(pageInfo) {
  console.log('pageLoader: ', this);
  pageInfo.loadIndex = configuration.katharos.pageActions.loadIndex;

  for (var i in pageInfo.plugins) {
    await this.assembler(pageInfo.plugins[i]);
  }

  await this.system.initializeController(pageInfo);
  await this.system.initializeMiddleware(pageInfo);
  await this.system
    .instantiateMiddleware(this, pageInfo)
    .then((res) => console.log(res));

  pageInfo.loaded = true;

  configuration.katharos.pageActions.loadIndex++;
}
async function pageReloader(pageInfo) {
  console.log('pageReloader: ', this);
  await this.system.instantiateMiddleware(this, pageInfo);
}
async function componentLoader(pageInfo) {
  console.log('componentLoader: ', this);
  var components = this.system.getComponents();

  //Clear Page
  document.getElementById('wrapper').innerHTML = '';

  //Generate Page Navigation Bar
  document.getElementById('wrapper').innerHTML += components.navbar.html;

  this.system.componentLoader('navigationBar', true);
  const current = this.system.getModule([components.navbar.arrayExpression]);
  current.loaded
    ? await pageReloader.call(this, current)
    : await pageLoader.call(this, current);

  this.addEvent('loadComponent', {
    componentId: this.system.getComponentId('navigationBar'),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });

  //Generate Page Body
  document.getElementById('content').innerHTML += components.loader.html;
  this.system.componentLoader('pageLoader', true);
  this.addEvent('loadComponent', {
    componentId: this.system.getComponentId('pageLoader'),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });

  //Generate Page Footer
  document.getElementById('content').innerHTML += components.footer.html;
  this.system.componentLoader('footer', true);
  this.addEvent('loadComponent', {
    componentId: this.system.getComponentId('footer'),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: window.endpoint
  });
}

export { pageLoader, pageReloader, dynamicChartLoader, componentLoader };
