import { pageActions, _dom } from "./core/kdom";
import { pageLoader } from "./core/instance";
import { pageObjects } from "./core/components";
import { initialization, plugins } from "./core/api";

const katharos = {
  pageActions: pageActions,
  pageLoader: pageLoader,
  pageObjects: pageObjects,
};

export { _dom, katharos, initialization };
