import { pageActions } from "./core/action.js";
import { pageLoader } from "./core/instance.js";
import { pageMiddleware } from "./core/middleware.js";
import { pageObjects } from "./core/object.js";
import { initialization } from "./core/api/index.js";

const katharos = {
  pageActions: pageActions,
  pageLoader: pageLoader,
  pageMiddleware: pageMiddleware,
  pageObjects: pageObjects,
};

export { katharos, initialization };
