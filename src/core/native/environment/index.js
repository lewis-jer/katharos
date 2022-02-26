import {
  pluginLoader,
  controllerLoader,
  middlewareLoader,
} from "./environment";
import { componentLoader } from "./hook-component";
import { dynamicChartLoader } from "./hook-chart";

const pageLoader = async function (pageInfo) {
  pageInfo.loadIndex = pageActions.loadIndex;
  await pluginLoader(pageInfo);
  await controllerLoader(pageInfo);
  await middlewareLoader(pageInfo);
  middleware[pageActions.loadIndex]
    ? middleware[pageActions.loadIndex]()
    : false;
  pageInfo.loaded = true;
  pageActions.loadIndex++;
};

const pageReloader = async function (pageInfo) {
  middleware[pageInfo.loadIndex]
    ? await middleware[pageInfo.loadIndex]()
    : false;
};

export { pageLoader, pageReloader, dynamicChartLoader, componentLoader };
