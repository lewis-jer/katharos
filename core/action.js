const pageActions = {
    loadPage: async function (currPage, pageName) {
      let router = await routerActions.getEndpoint(currPage, pageName);
      console.log(router);
      if (router.sourceRouteInformation.loaded) {
        eventMiddleware.addEvent('clearPage', {
          documentId: documents[currPage].id,
          userIdentifier: router.authentication.userId,
          location: currPage
        });
        await pageActions.clearPage(router.sourceRouteInformation);
      }

      window.endpoint = router.route;
      await pageActions.generatePage(router.route, router.routeInformation);
      eventMiddleware.addEvent('generatePage', {
        documentId: documents[router.route].id,
        userIdentifier: router.authentication.userId,
        target: router.route
      });
    },
    clearPage: async function (pageInfo) {
      await pageMiddleware.dynamicTableDestructor(pageInfo);
      await pageMiddleware.pageDestructor(pageInfo);
    },
    gatherPageInfo: function (pageName) {
      return arrayFunctions.arrayToObject(modulePath)[pageName];
    },
    generatePage: async function (pageName, pageInfo) {
      await pageMiddleware.drawPage(pageName, pageInfo);
    },
    selective: [''],
    loadIndex: 1,
    excludes: ['r', 'login'],
    function: true
} 
export { pageActions }