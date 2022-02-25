import { loadPage, clearPage } from "./action-canvas";
import { gatherPageInfo } from "./util/index.js";
import { generatePage } from "../native/index.js";

const pageActions = {
  loadPage: loadPage,
  clearPage: clearPage,
  gatherPageInfo: gatherPageInfo,
  generatePage: generatePage,
  selective: [""],
  loadIndex: 1,
  function: true,
};
export { pageActions };
