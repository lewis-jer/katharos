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
  history.pushState({}, null, document.URL.slice(0, document.URL.lastIndexOf('/') + 1) + pageInfo.endpoint);
  let { animatedElements } = pageInfo;
  var navbarStatus = this.system.getComponentStatus('navigationBar');
  let publicExclusions = this.system.getExclusion('public');
  let systemExclusions = this.system.getExclusion('system');
  pageInfo.exclusions = [publicExclusions.includes(pageInfo.endpoint), systemExclusions.includes(pageInfo.endpoint)];

  if (this.system.getComponentStatus('preloader')) {
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
}

function loadPage() {
  return async (currPage, pageName) => {
    window.history_log.push({ previous: currPage, current: pageName });
    localStorage.setItem('view', JSON.stringify({ previous: currPage, current: pageName }));
    let router = await this.system.router.get(this.gatherPageInfo(currPage), this.gatherPageInfo(pageName));
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

// (function (global) {
//   if (typeof global === 'undefined') throw new Error('window is undefined');
//   var _hash = '!';

//   var navigationGuard = function () {
//     let view = localStorage.getItem('view');
//     for (let entry of global.history_log) console.log(entry);
//   };

//   var noBackPlease = function () {
//     global.location.href += '#';
//     global.setTimeout(function () {
//       global.location.href += '!';
//       let view = localStorage.getItem('view');
//       for (let entry of global.history_log) console.log(entry);
//     }, 50);
//   };

//   global.onhashchange = function () {
//     if (global.location.hash !== _hash) global.location.hash = _hash;
//   };

//   global.onload = function () {
//     noBackPlease();

//     document.body.onkeydown = function (e) {
//       var elm = e.target.nodeName.toLowerCase();
//       if (e.which === 8 && elm !== 'input' && elm !== 'textarea') e.preventDefault();
//       e.stopPropagation();
//     };
//   };
// })(window);

export { loadPage, pageAnimations };
