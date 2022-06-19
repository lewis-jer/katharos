import { getEndpoint } from '../../../../katharos-router';
import { generate, clearPage } from '../native';

function loadPage() {
  console.log('loadPage: ', this);
  const generatePage = generate(this);
  return async (currPage, pageName) => {
    let router = await getEndpoint(this, currPage, pageName);
    let page = this.system.getView(currPage);
    if (router.sourceRouteInformation.loaded) {
      this.addEvent('clearPage', {
        documentId: page.id,
        userIdentifier: router.authentication.userId,
        location: currPage
      });
      await clearPage(this, router.sourceRouteInformation);
    }

    window.endpoint = router.route;
    let destination = this.system.getView(router.route);
    await generatePage(router.route, router.routeInformation);
    this.addEvent('generatePage', {
      documentId: destination.id,
      userIdentifier: router.authentication.userId,
      target: router.route
    });
  };
}

export { loadPage };
