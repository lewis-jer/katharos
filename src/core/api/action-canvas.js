import { getEndpoint } from '../../../../katharos-router/index.js';
import { buildPage, componentLoader, pageLoader, pageReloader, terminateLoader } from './render.js';

async function pageAnimations(animations) {
  for (var animation of animations) {
    if (!animation.enabled) continue;
    if (animation.promise) await $(`#${animation.id}`)[animation.style](animation.delay).promise();
    if (!animation.promise) $(`#${animation.id}`)[animation.style](animation.delay).promise();

    await $(`#${animation.id}`)
      .promise()
      .done(() => {});
    return true;
  }
  return true;
}

async function pageDestructor(pageInfo) {
  let { animatedElements } = pageInfo;
  if ('animatedElements' in pageInfo) for (var animation of animatedElements) if (animation.type == 'ondestroy') await pageAnimations([animation]);

  let animations = await pageAnimations([
    { id: pageInfo.viewport, delay: pageInfo?.delay || 500, promise: true, style: 'fadeOut', enabled: true },
    { id: 'footer', delay: 500, promise: true, enabled: !pageInfo.document, style: 'fadeOut' }
  ]);

  if (animations) document.getElementById(pageInfo.viewport).innerHTML = '';
  if ('navLocation' in pageInfo) document.getElementById(pageInfo.navLocation).classList.remove('active');
  if ('navItem' in pageInfo) document.getElementById(pageInfo.navItem).classList.remove('active');
}

async function dynamicTableDestructor(pageInfo) {
  if (!('dynamicTables' in pageInfo)) return 'Dynamic Tables Not Configured...';
  if (pageInfo.dynamicTables?.status) return 'Dynamic Tables Not Enabled';
  for (var i in pageInfo.dynamicTables.tables) this.emptyTable(pageInfo.dynamicTables.tables[i], true);
}

async function drawPage(pageInfo) {
  let { animatedElements } = pageInfo;
  var preloaderStatus = this.system.getComponentStatus('preloader');
  var navbarStatus = this.system.getComponentStatus('navigationBar');
  let publicExclusions = this.system.getExclusion('public');
  let systemExclusions = this.system.getExclusion('system');
  pageInfo.exclusions = [publicExclusions.includes(pageInfo.endpoint), systemExclusions.includes(pageInfo.endpoint)];

  if (preloaderStatus) {
    document.getElementById('preloader').style.display = 'none';
    this.system.componentLoader('preloader', false);
  }

  if (pageInfo.document && pageInfo.exclusions[1]) this.system.componentLoader('navigationBar', false);
  else if (!pageInfo.document && !navbarStatus) await componentLoader.call(this, pageInfo);
  else document.querySelector('#loader').style.display = 'flex';

  await buildPage.call(this, pageInfo);
  !pageInfo.loaded ? await pageLoader.call(this, pageInfo) : await pageReloader.call(this, pageInfo);
  await terminateLoader.call(this, pageInfo);
  pageInfo.exclusions[1] &&
    (await pageAnimations([{ id: pageInfo.viewport, delay: pageInfo?.delay || 500, promise: true, style: 'fadeIn', enabled: true }]));
  if ('animatedElements' in pageInfo) for (var animation of animatedElements) if (animation.type == 'oncreate') await pageAnimations([animation]);
  history.replaceState({}, null, document.URL.slice(0, document.URL.lastIndexOf('/') + 1) + pageInfo.endpoint);
}

function loadPage() {
  return async (currPage, pageName) => {
    let router = await getEndpoint(this, currPage, pageName);
    let page = this.system.getModule(currPage);
    let event = { documentId: page?.id, userIdentifier: router.authentication.userId, location: currPage };
    if (router.sourceRouteInformation?.loaded) {
      this.addEvent('clearPage', event);
      await dynamicTableDestructor.call(this, router.sourceRouteInformation);
      await pageDestructor.call(this, router.sourceRouteInformation);
    }

    this.system.setSecureURL(router.route);
    let destination = this.system.getModule(router.route);
    event = { documentId: destination.id, userIdentifier: router.authentication.userId, target: router.route };
    await drawPage.call(this, router.routeInformation);
    this.addEvent('generatePage', event);
    return 'Page Loaded';
  };
}

export { loadPage, pageAnimations };
