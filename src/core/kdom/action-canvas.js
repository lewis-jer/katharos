const loadPage = async () => {
  let router = await routerActions.getEndpoint(currPage, pageName);
  console.log(router);
  if (router.sourceRouteInformation.loaded) {
    eventMiddleware.addEvent("clearPage", {
      documentId: documents[currPage].id,
      userIdentifier: router.authentication.userId,
      location: currPage,
    });
    await pageActions.clearPage(router.sourceRouteInformation);
  }

  window.endpoint = router.route;
  await pageActions.generatePage(router.route, router.routeInformation);
  eventMiddleware.addEvent("generatePage", {
    documentId: documents[router.route].id,
    userIdentifier: router.authentication.userId,
    target: router.route,
  });
};

const clearPage = async () => {
  await pageMiddleware.dynamicTableDestructor(pageInfo);
  await pageMiddleware.pageDestructor(pageInfo);
};

export { loadPage, clearPage };
