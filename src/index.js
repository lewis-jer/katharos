import { pageActions } from "./core/kdom/action";
import { pageLoader } from "./core/instance";
import { pageObjects } from "./core/object";
import { initialization, plugins } from "./core/api/index";

const katharos = {
  pageActions: pageActions,
  pageLoader: pageLoader,
  pageObjects: pageObjects,
};

export { katharos, initialization };
