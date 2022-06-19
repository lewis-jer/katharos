import { getEndpoint } from '../../../../katharos-router';
import { generate, clearPage } from '../native';

const loadPage = (_api) => {
  const generatePage = generate(_api);
  return async (currPage, pageName) => {
    let router = await getEndpoint(_api, currPage, pageName);
    let page = _api.system.getView(currPage);
    console.log(currPage, pageName);
    console.log(page);
    if (router.sourceRouteInformation.loaded) {
      _api.addEvent('clearPage', {
        documentId: page.id,
        userIdentifier: router.authentication.userId,
        location: currPage
      });
      await clearPage(_api, router.sourceRouteInformation);
    }

    window.endpoint = router.route;
    let destination = _api.system.getView(router.route);
    console.log(router.route);
    console.log(destination);
    await generatePage(router.route, router.routeInformation);
    _api.addEvent('generatePage', {
      documentId: documents[router.route].id,
      userIdentifier: router.authentication.userId,
      target: router.route
    });
  };
};

export { loadPage };
