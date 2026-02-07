function executeScripts(containerElement) {
  const scripts = containerElement.querySelectorAll('script');
  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value);
    });
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });

  // Transform any text/babel scripts that were just added
  if (window.Babel && window.Babel.transformScriptTags) {
    window.Babel.transformScriptTags();
  }
}

async function buildPage(pageInfo) {
  try {
    if (this.system.data.lifecycleHooks?.beforeBuildPage) {
      this.system.data.lifecycleHooks.beforeBuildPage(pageInfo);
    }
  } catch (error) {
    console.log(error);
  }

  var body = this.system.getModule(pageInfo.arrayExpression).html;
  const viewportElement = document.getElementById(pageInfo.viewport);

  if (viewportElement && this.system.data.renderEngine) {
    viewportElement.style.display = 'none';
    viewportElement.innerHTML = body;
    executeScripts(viewportElement);
  }

  try {
    // Application-specific lifecycle hook for navigation state
    if (this.system.data.lifecycleHooks?.onBuildPage) {
      await this.system.data.lifecycleHooks.onBuildPage(pageInfo, this.system.data.renderEngine);
    }
  } catch (error) {
    console.log(error);
  }
}

async function pageAnimations(animations) {
  for (var animation of animations) {
    if (!animation.enabled) continue;
    await new Promise(async (resolve) => {
      let renderAnimation = this.system.data.animation[animation.style](`#${animation.id}`, animation.delay);
      const renderAnimationAwait = await renderAnimation;
      resolve();
    });
  }
  return true;
}

async function pageDestructor(pageInfo) {
  let { animatedElements } = pageInfo;
  if ('animatedElements' in pageInfo)
    for (var animation of animatedElements) if (animation.type == 'ondestroy') await pageAnimations.call(this, [animation]);

  await new Promise(async (resolve) => {
    let body = pageAnimations.call(this, [{ id: pageInfo.viewport, delay: pageInfo?.delay || 350, promise: true, style: 'fadeOut', enabled: true }]);
    let foot = pageAnimations.call(this, [{ id: 'footer', delay: 350, promise: true, style: 'fadeOut', enabled: true }]);
    const bodyAwait = await body;
    const footAwait = await foot;
    await Promise.resolve((document.getElementById(pageInfo.viewport).innerHTML = ''));
    resolve();
  });

  try {
    if (this.system.data.lifecycleHooks?.onDestroyPage) {
      this.system.data.lifecycleHooks.onDestroyPage(pageInfo);
    }
  } catch (error) {
    console.log(error);
  }
}

async function terminateLoader(pageInfo) {
  const termination = async (x) =>
    await new Promise(async (resolve) => {
      document.querySelector('#loader').style.display = 'none';
      let body = pageAnimations.call(this, [{ id: pageInfo.viewport, delay: pageInfo?.delay || 350, promise: true, style: 'fadeIn', enabled: true }]);
      let foot = pageAnimations.call(this, [{ id: 'footer', delay: 350, promise: true, style: 'fadeIn', enabled: true }]);
      const bodyAwait = await body;
      const footAwait = await foot;
      return resolve(true);
    });

  if (!pageInfo.document) return await termination(pageInfo.name);
  else return 'Loader Not Initialized';
}

function loadPage() {
  return async (pageName, state = false) => {
    try {
      if (this.system.data.lifecycleHooks?.configureLoadPage) {
        const originalPageName = pageName;
        const originalState = state;

        const result = this.system.data.lifecycleHooks.configureLoadPage(pageName, state);

        if (result) {
          pageName = result.pageName ?? originalPageName;
          state = result.state ?? originalState;
        }
      }
    } catch (error) {
      console.log(error);
    }

    let currPage = `${this.system.getSecureContainer().url}` || '';
    let event = { location: currPage };
    let current = this.system.getModule(currPage);
    if (current && current.loaded) {
      this.addEvent('clearPage', event);
      await pageDestructor.call(this, current);
      if (!current?.document) document.querySelector('#loader').style.display = 'flex';
      // current.loaded = !current.loaded;
    }

    // Issue is with the router here
    let router = await this.system.router.get(currPage, pageName);
    let baseURL = await Promise.resolve(document.URL.slice(0, document.URL.lastIndexOf('/') + 1));
    await Promise.resolve(this.system.setSecureURL(router.route));
    if (!('z50230' in document)) {
      sessionStorage.setItem('29b193de-2725-41b7-b8aa-4363c4e041ba', JSON.stringify({ previous: currPage, current: router.route }));
    }

    if (this.system.getComponentStatus('preloader')) {
      document.getElementById('preloader').style.display = 'none';
      this.system.componentLoader('preloader', false);
    }

    if (!('z50230' in document)) {
      var navbarStatus = this.system.getComponentStatus('navigationBar');

      if (router.routeInformation.document) this.system.componentLoader('navigationBar', false);
      else if (!router.routeInformation.document && !navbarStatus) await this.loadComponents(router.routeInformation);

      if (currPage && !state) {
        let targetEndpoint = router?.routeInformation?.endpoint;

        try {
          if (this.system.data.lifecycleHooks?.configurePushState) {
            const originalEndpoint = router?.routeInformation?.endpoint;

            const result = this.system.data.lifecycleHooks.configurePushState(router.routeInformation.endpoint);

            if (result) {
              targetEndpoint = result.endpoint ?? originalEndpoint;
            }
          }
        } catch (error) {
          console.log(error);
        }

        history.pushState({}, null, baseURL + targetEndpoint);
      }
    }

    this.formLoaderStatus = {};
    let destination = this.gatherPageInfo(router.route);
    event = { documentId: destination.id, target: router.route };
    window.history_log.push({ previous: currPage, current: router.routeInformation.endpoint });
    let pageInfo = router.routeInformation;

    let { animatedElements } = pageInfo;

    await buildPage.call(this, pageInfo);

    // if (!('z50230' in document)) {
    //   await terminateLoader.call(this, pageInfo);
    // }

    !pageInfo.loaded ? await this.system.loadMiddleware(this, pageInfo) : await this.system.reloadMiddleware(this, pageInfo);

    if (!('z50230' in document)) {
      await terminateLoader.call(this, pageInfo);
      pageInfo.document &&
        (await pageAnimations.call(this, [{ id: pageInfo.viewport, delay: pageInfo?.delay || 500, promise: true, style: 'fadeIn', enabled: true }]));
      if ('animatedElements' in pageInfo)
        for (var animation of animatedElements) if (animation.type == 'oncreate') await pageAnimations.call(this, [animation]);
    }

    this.addEvent('generatePage', event);
    return 'Page Loaded';
  };
}

export { loadPage, pageAnimations };
