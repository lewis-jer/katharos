import { loadPage } from "./action-canvas";
import { gatherPageInfo } from "./util/index.js";

const pageActions = {
  loadPage: loadPage,
  gatherPageInfo: gatherPageInfo,
  selective: [""],
  loadIndex: 1,
  function: true,
};
export { pageActions };
