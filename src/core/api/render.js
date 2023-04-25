async function pageLoader(pageInfo) {
  pageInfo.loadIndex = this.system.getLoadIndex();
  for (var i in pageInfo.plugins) await this.assembler(pageInfo.plugins[i]);
  await this.system.initializeController(pageInfo);
  await this.system.initializeMiddleware(pageInfo);
  await this.system.instantiateMiddleware(this, pageInfo).then((res) => console.log(res));
  pageInfo.loaded = true;
  this.system.incrementLoadIndex();
}

async function pageReloader(pageInfo) {
  await this.system.instantiateMiddleware(this, pageInfo);
}

async function componentLoader(pageInfo) {
  var components = this.system.getComponents();
  let event = { userIdentifier: JSON.parse(localStorage.getItem('user')).email || null, location: pageInfo.endpoint };
  document.getElementById(components.navbar.viewport).innerHTML = '';
  document.getElementById(components.navbar.viewport).innerHTML += components.navbar.html;
  document.getElementById(components.navbar.viewport).style.display = 'block';

  this.system.componentLoader('navigationBar', true);
  const current = this.system.getModule([components.navbar.arrayExpression]);
  await $(`#${components.navbar.contentport}`).fadeIn(500).promise();
  current.loaded ? await pageReloader.call(this, current) : await pageLoader.call(this, current);
  event.componentId = this.system.getComponentId('navigationBar');
  this.addEvent('loadComponent', event);

  document.getElementById('content').innerHTML += components.loader.html;
  this.system.componentLoader('pageLoader', true);
  event.componentId = this.system.getComponentId('pageLoader');
  this.addEvent('loadComponent', event);

  document.getElementById('content').innerHTML += components.footer.html;
  this.system.componentLoader('footer', true);
  event.componentId = this.system.getComponentId('footer');
  this.addEvent('loadComponent', event);
}

async function terminateLoader(pageInfo) {
  const termination = (x) =>
    new Promise((resolve) =>
      $(document).ready(async function (event) {
        document.querySelector('#loader').style.display = 'none';
        analytics.page(x);
        $('#loaderDiv').fadeIn(pageInfo?.delay || 500);
        $('#footer').fadeIn(750);
        resolve();
      })
    );
  if (!pageInfo.exclusions[1]) return await termination(pageInfo.name);
  else return 'Loader Not Initialized';
}

async function buildPage(pageInfo) {
  var body = this.system.getModule(pageInfo.arrayExpression).html;
  document.getElementById(pageInfo.viewport).style.display = 'none';
  if ('navLocation' in pageInfo) document.getElementById(pageInfo.navLocation).classList.add('active');
  if ('navItem' in pageInfo) document.getElementById(pageInfo.navItem).classList.add('active');
  document.getElementById(pageInfo.viewport).innerHTML = body;
}

export { buildPage, componentLoader, pageLoader, pageReloader, terminateLoader };
