import { loadPage, clearPage } from "./action-canvas";

const pageActions = {
  loadPage: loadPage,
  clearPage: clearPage,
  gatherPageInfo: function (pageName) {
    return arrayFunctions.arrayToObject(modulePath)[pageName];
  },
  generatePage: async function (pageName, pageInfo) {
    await pageMiddleware.drawPage(pageName, pageInfo);
  },
  selective: [""],
  loadIndex: 1,
  excludes: ["r", "login"],
  function: true,
};
export { pageActions };
