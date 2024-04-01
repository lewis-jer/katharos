import { buildPage, componentLoader, pageLoader, pageReloader } from './render.js';

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

  if ('navLocation' in pageInfo) document.getElementById(pageInfo.navLocation).classList.remove('active');
  if ('navItem' in pageInfo) document.getElementById(pageInfo.navItem).classList.remove('active');
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
  if (!pageInfo.exclusions[1]) return await termination(pageInfo.name);
  else return 'Loader Not Initialized';
}

function loadPage() {
  return async (currPage, pageName) => {
    let currentView = this.gatherPageInfo(currPage);
    let newView = this.gatherPageInfo(pageName);
    let event = { documentId: currentView?.id, location: currPage };

    if (currentView?.loaded) {
      this.addEvent('clearPage', event);
      await pageDestructor.call(this, currentView);
      if (!currentView.document) document.querySelector('#loader').style.display = 'flex';
    }

    await Promise.resolve(this.system.setSecureURL(pageName));
    let router = await this.system.router.get(currentView, newView);
    let baseURL = await Promise.resolve(document.URL.slice(0, document.URL.lastIndexOf('/') + 1));
    await Promise.resolve(this.system.setSecureURL(router.route));
    sessionStorage.setItem('29b193de-2725-41b7-b8aa-4363c4e041ba', JSON.stringify({ previous: currPage, current: router.route }));

    if (this.system.getComponentStatus('preloader')) {
      document.getElementById('preloader').style.display = 'none';
      this.system.componentLoader('preloader', false);
    }

    var navbarStatus = this.system.getComponentStatus('navigationBar');
    let publicExclusions = this.system.getExclusion('public');
    let systemExclusions = this.system.getExclusion('system');
    router.routeInformation.exclusions = [
      publicExclusions.includes(router.routeInformation.endpoint),
      systemExclusions.includes(router.routeInformation.endpoint)
    ];

    if (router.routeInformation.document && router.routeInformation.exclusions[1]) this.system.componentLoader('navigationBar', false);
    else if (!router.routeInformation.document && !navbarStatus) await componentLoader.call(this, router.routeInformation);

    if (!!currPage) history.pushState({}, null, baseURL + router.routeInformation.endpoint);
    else history.replaceState({}, null, baseURL + router.routeInformation.endpoint);

    this.formLoaderStatus = {};
    let destination = this.gatherPageInfo(router.route);
    event = { documentId: destination.id, target: router.route };
    window.history_log.push({ previous: currPage, current: router.routeInformation.endpoint });
    let pageInfo = router.routeInformation;
    let { animatedElements } = pageInfo;

    await buildPage.call(this, pageInfo);
    await terminateLoader.call(this, pageInfo);
    !pageInfo.loaded ? await pageLoader.call(this, pageInfo) : await pageReloader.call(this, pageInfo);
    pageInfo.exclusions[1] &&
      (await pageAnimations.call(this, [{ id: pageInfo.viewport, delay: pageInfo?.delay || 500, promise: true, style: 'fadeIn', enabled: true }]));
    if ('animatedElements' in pageInfo)
      for (var animation of animatedElements) if (animation.type == 'oncreate') await pageAnimations.call(this, [animation]);

    this.addEvent('generatePage', event);
    return 'Page Loaded';
  };
}

export { loadPage, pageAnimations };
