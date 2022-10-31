import { getEndpoint } from '../../../../katharos-router';
import { generatePage, clearPage } from '../native';

function loadPage() {
  return async (currPage, pageName) => {
    let router = await getEndpoint(this, currPage, pageName);
    let page = this.system.getView(currPage);
    if (router.sourceRouteInformation.loaded) {
      this.addEvent('clearPage', {
        documentId: page.id,
        userIdentifier: router.authentication.userId,
        location: currPage
      });
      await clearPage.call(this, router.sourceRouteInformation);
    }

    window.endpoint = router.route;
    this.system.setSecureURL(router.route);
    let destination = this.system.getView(router.route);
    await generatePage.call(this, router.route, router.routeInformation);
    this.addEvent('generatePage', {
      documentId: destination.id,
      userIdentifier: router.authentication.userId,
      target: router.route
    });
  };
}

export { loadPage };
