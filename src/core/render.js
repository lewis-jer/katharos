async function pageLoader(pageInfo) {
  try {
    // Guard against overwriting existing loadIndex for already loaded modules
    if (pageInfo.loadIndex == null || pageInfo.loadIndex === undefined) {
      pageInfo.loadIndex = this.system.getLoadIndex();
      this.system.incrementLoadIndex();
    }

    for (var i in pageInfo.plugins) await this.assembler(pageInfo.plugins[i]);
    await this.system.initializeMiddleware(pageInfo);
    await this.system.instantiateMiddleware(this, pageInfo);
    pageInfo.loaded = true;
  } catch (error) {
    console.error('[pageLoader] Error:', error);
    throw error;
  }
}

async function pageReloader(pageInfo) {
  // Ensure pageInfo has a valid loadIndex before instantiating middleware
  if (pageInfo.loadIndex == null || pageInfo.loadIndex === undefined) {
    console.warn('[pageReloader] Missing loadIndex for already loaded page, assigning new one');
    pageInfo.loadIndex = this.system.getLoadIndex();
    this.system.incrementLoadIndex();
    await this.system.initializeMiddleware(pageInfo);
  }
  await this.system.instantiateMiddleware(this, pageInfo);
}

async function componentLoader(pageInfo) {
  var components = this.system.getComponents();
  let event = { location: pageInfo.endpoint };
  var _navbar = components.navbar || this.system.getModule('navbar');

  const navViewport = document.getElementById(_navbar.viewport);
  if (navViewport) {
    navViewport.innerHTML = '';
    let page = this.system.data.animation.fadeIn(`#${_navbar.viewport}`, pageInfo?.delay || 350);
    const pageAwait = await page;
    navViewport.innerHTML += _navbar.html;
  }

  this.system.componentLoader('navigationBar', true);
  const current = this.system.getModule([_navbar.arrayExpression]);
  let nav = this.system.data.animation.fadeIn(`#${_navbar.contentport}`, pageInfo?.delay || 350, { display: 'flex' });
  const navAwait = await nav;
  current.loaded ? await pageReloader.call(this, current) : await pageLoader.call(this, current);
  event.componentId = this.system.getComponentId('navigationBar');
  this.addEvent('loadComponent', event);

  const loaderElement = document.getElementById(components.loader.selector);
  if (loaderElement) {
    loaderElement.innerHTML += components.loader.html;
  }

  this.system.componentLoader('pageLoader', true);
  event.componentId = this.system.getComponentId('pageLoader');
  this.addEvent('loadComponent', event);

  const footerElement = document.getElementById(components.footer.selector);
  if (footerElement) {
    footerElement.innerHTML += components.footer.html;
  }

  this.system.componentLoader('footer', true);
  event.componentId = this.system.getComponentId('footer');
  this.addEvent('loadComponent', event);
}

async function buildPage(pageInfo) {
  var body = this.system.getModule(pageInfo.arrayExpression).html;
  const viewportElement = document.getElementById(pageInfo.viewport);
  if (viewportElement) {
    viewportElement.style.display = 'none';
    viewportElement.innerHTML = body;
  }

  if ('navLocation' in pageInfo) {
    const navLocationElement = document.getElementById(pageInfo.navLocation);
    if (navLocationElement) navLocationElement.classList.add('active');
  }

  if ('navItem' in pageInfo) {
    const navItemElement = document.getElementById(pageInfo.navItem);
    if (navItemElement) navItemElement.classList.add('active');
  }
}

export { buildPage, componentLoader, pageLoader, pageReloader };
