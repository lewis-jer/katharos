import { pageActions } from "./core/action";
import { pageLoader } from "./core/instance";
import { pageMiddleware } from "./core/middleware";
import { pageObjects } from "./core/object";
import { initialization } from "./core/api/index";

const fs = require("fs");
const dir = "./core";

fs.existsSync(dir) ? console.log("Directory exists") : false;

const katharos = {
  pageActions: pageActions,
  pageLoader: pageLoader,
  pageMiddleware: pageMiddleware,
  pageObjects: pageObjects,
};

export { katharos, initialization };
