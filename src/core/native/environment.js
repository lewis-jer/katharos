async function dynamicChartLoader() {
  if (!Object.keys(this.system.data.pluginLib).includes(this.system.stringToHash(verb.src))) {
    // Generate Page Charts
    window.verbAsyncInit = function () {
      Verb.init({
        apiKey: configs.chart,
        version: 'v1.0',
        authParams: {
          userToken: `${JSON.parse(localStorage.getItem('user')).accessToken}`
        }
      });
    };

    await document.getElementsByTagName('head')[0].appendChild(verb);
    this.system.updatePlugin(verb.src);
  } else {
    window.Verb.init({
      apiKey: configs.chart,
      version: 'v1.0',
      authParams: {
        userToken: `${JSON.parse(localStorage.getItem('user')).accessToken}`
      }
    });
  }
}

async function pageLoader(pageInfo) {
  console.log(pageInfo);
  pageInfo.loadIndex = this.pageActions.loadIndex;

  for (var i in pageInfo.plugins) {
    await this.assembler(pageInfo.plugins[i]);
  }

  await this.system.initializeController(pageInfo);
  await this.system.initializeMiddleware(pageInfo);
  await this.system.instantiateMiddleware(this, pageInfo).then((res) => console.log(res));

  pageInfo.loaded = true;
  this.pageActions.loadIndex++;
}

async function pageReloader(pageInfo) {
  await this.system.instantiateMiddleware(this, pageInfo);
}

async function componentLoader(pageInfo) {
  var components = this.system.getComponents();
  document.getElementById('wrapper').innerHTML = '';
  document.getElementById('wrapper').innerHTML += components.navbar.html;

  this.system.componentLoader('navigationBar', true);
  const current = this.system.getModule([components.navbar.arrayExpression]);
  current.loaded ? await pageReloader.call(this, current) : await pageLoader.call(this, current);
  this.addEvent('loadComponent', {
    componentId: this.system.getComponentId('navigationBar'),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: pageInfo.endpoint
  });

  document.getElementById('content').innerHTML += components.loader.html;
  this.system.componentLoader('pageLoader', true);
  this.addEvent('loadComponent', {
    componentId: this.system.getComponentId('pageLoader'),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: pageInfo.endpoint
  });

  document.getElementById('content').innerHTML += components.footer.html;
  this.system.componentLoader('footer', true);
  this.addEvent('loadComponent', {
    componentId: this.system.getComponentId('footer'),
    userIdentifier: JSON.parse(localStorage.getItem('user')).email,
    location: pageInfo.endpoint
  });
}

export { pageLoader, pageReloader, dynamicChartLoader, componentLoader };
