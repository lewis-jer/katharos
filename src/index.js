import { pageActions } from "./core/kdom/action";
import { pageLoader } from "./core/instance";
import { pageMiddleware } from "./core/middleware";
import { pageObjects } from "./core/object";
import { initialization, plugins } from "./core/api/index";

const katharos = {
  pageActions: pageActions,
  pageLoader: pageLoader,
  pageMiddleware: pageMiddleware,
  pageObjects: pageObjects,
};

export { katharos, initialization };
