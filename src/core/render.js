async function pageLoader(pageInfo) {
  pageInfo.loadIndex = this.system.getLoadIndex();
  for (var i in pageInfo.plugins) await this.assembler(pageInfo.plugins[i]);
  await this.system.initializeMiddleware(pageInfo);
  await this.system.instantiateMiddleware(this, pageInfo).then((res) => res /* console.log(res) */);
  pageInfo.loaded = true;
  this.system.incrementLoadIndex();
}

async function pageReloader(pageInfo) {
  await this.system.instantiateMiddleware(this, pageInfo);
}

async function componentLoader(pageInfo) {
  var components = this.system.getComponents();
  let event = { location: pageInfo.endpoint };
  var _navbar = components.navbar || this.system.getModule('navbar');
  document.getElementById(_navbar.viewport).innerHTML = '';
  let page = this.system.data.animation.fadeIn(`#${_navbar.viewport}`, pageInfo?.delay || 350);
  const pageAwait = await page;
  document.getElementById(_navbar.viewport).innerHTML += _navbar.html;

  this.system.componentLoader('navigationBar', true);
  const current = this.system.getModule([_navbar.arrayExpression]);
  let nav = this.system.data.animation.fadeIn(`#${_navbar.contentport}`, pageInfo?.delay || 350, { display: 'flex' });
  const navAwait = await nav;
  current.loaded ? await pageReloader.call(this, current) : await pageLoader.call(this, current);
  event.componentId = this.system.getComponentId('navigationBar');
  this.addEvent('loadComponent', event);

  document.getElementById(components.loader.selector).innerHTML += components.loader.html;
  this.system.componentLoader('pageLoader', true);
  event.componentId = this.system.getComponentId('pageLoader');
  this.addEvent('loadComponent', event);

  document.getElementById(components.footer.selector).innerHTML += components.footer.html;
  this.system.componentLoader('footer', true);
  event.componentId = this.system.getComponentId('footer');
  this.addEvent('loadComponent', event);
}

async function buildPage(pageInfo) {
  var body = this.system.getModule(pageInfo.arrayExpression).html;
  document.getElementById(pageInfo.viewport).style.display = 'none';
  if ('navLocation' in pageInfo) document.getElementById(pageInfo.navLocation).classList.add('active');
  if ('navItem' in pageInfo) document.getElementById(pageInfo.navItem).classList.add('active');
  document.getElementById(pageInfo.viewport).innerHTML = body;
}

export { buildPage, componentLoader, pageLoader, pageReloader };
