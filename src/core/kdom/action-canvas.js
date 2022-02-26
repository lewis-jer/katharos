import { getEndpoint } from "../../../../katharos-router";
import { generatePage, clearPage } from "../native/index.js";

const loadPage = async (currPage, pageName) => {
  let router = await getEndpoint(currPage, pageName);
  if (router.sourceRouteInformation.loaded) {
    eventMiddleware.addEvent("clearPage", {
      documentId: documents[currPage].id,
      userIdentifier: router.authentication.userId,
      location: currPage,
    });
    await clearPage(router.sourceRouteInformation);
  }

  window.endpoint = router.route;
  await generatePage(router.route, router.routeInformation);
  eventMiddleware.addEvent("generatePage", {
    documentId: documents[router.route].id,
    userIdentifier: router.authentication.userId,
    target: router.route,
  });
};

export { loadPage };
