import { pageActions } from "./core/action";
import { pageLoader } from "./core/instance";
import { pageMiddleware } from "./core/middleware";
import { pageObjects } from "./core/object";
import { initialization } from "./core/api/index";

try {
  console.log(require.resolve("katgood"));
} catch (e) {
  console.error("katharos is not found");
  process.exit(e.code);
}

const katharos = {
  pageActions: pageActions,
  pageLoader: pageLoader,
  pageMiddleware: pageMiddleware,
  pageObjects: pageObjects,
};

export { katharos, initialization };
