import { plugins, assembler, meta } from './plugin.js';
import { pageObjects } from './components.js';
import { helper } from './helper/index.js';
import { gatherPageInfo, selectionController, getDeviceType } from './util.js';
import { initialization } from './init.js';
import { System } from './helper/system.js';
import { loadPage } from './action-canvas.js';

const system = new System({ name: 'system-reserved' });

let _api = {
  ...helper.dataHandler,
  ...helper.eventHandler,
  system: system,
  user: system.getUser(),
  store: system.getStore(),
  meta: meta
};

_api = {
  ..._api,
  ...pageObjects(_api),
  ...helper.tableMiddleware(_api),
  selectionController: selectionController(_api),
  gatherPageInfo: gatherPageInfo(_api)
};

_api = {
  ..._api,
  modalSync: helper.modalSync(_api),
  assembler: assembler(_api)
};

_api = {
  ..._api,
  ...new helper.formMiddleware(_api).helper,
  init: initialization(_api),
  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  getDeviceType: getDeviceType
};

console.log('Framework API: ', JSON.parse(JSON.stringify(_api)));

_api = {
  ..._api,
  pageActions: { loadPage: loadPage.call(_api) }
};

window._katharos_api_ = _api;
window._katharos_system_ = system;

export { _api, plugins };
